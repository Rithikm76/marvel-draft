"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CharacterVariant, DraftedCard, GameMode, ScoreResult, TeamState } from "@/lib/types"
import { generateOffer, remainingDraftable, type OfferConstraints } from "@/engine/draftGenerator"
import { scoreTeam, teamFit } from "@/engine/scoringEngine"
import { makeRng, randomSeed } from "@/engine/rng"

const STORAGE_KEY = "marvel-draft-v1"
const PICK_SECONDS = 45

const ROUNDS_PER_SEAT: Record<GameMode, number> = { solo: 6, "1v1": 6, "2v2": 3 }

interface Seat {
  index: number
  player: string
  teamId: string
  teamName: string
  isAI: boolean
}

interface Pick {
  seatIndex: number
  teamId: string
  card: DraftedCard
}

interface SavedGame {
  mode: GameMode
  seed: number
  picks: Pick[]
}

type Phase = "menu" | "drafting" | "results"

function buildSeats(mode: GameMode): Seat[] {
  if (mode === "solo") {
    return [
      { index: 0, player: "You", teamId: "A", teamName: "Your Team", isAI: false },
      { index: 1, player: "CPU", teamId: "B", teamName: "Rival CPU", isAI: true },
    ]
  }
  if (mode === "1v1") {
    return [
      { index: 0, player: "Player 1", teamId: "A", teamName: "Player 1", isAI: false },
      { index: 1, player: "Player 2", teamId: "B", teamName: "Player 2", isAI: false },
    ]
  }
  // 2v2: two sides, two drafters each.
  return [
    { index: 0, player: "P1", teamId: "A", teamName: "Team Red", isAI: false },
    { index: 1, player: "P2", teamId: "B", teamName: "Team Blue", isAI: false },
    { index: 2, player: "P3", teamId: "A", teamName: "Team Red", isAI: false },
    { index: 3, player: "P4", teamId: "B", teamName: "Team Blue", isAI: false },
  ]
}

function buildDraftOrder(numSeats: number, rounds: number): number[] {
  const order: number[] = []
  for (let r = 0; r < rounds; r++) {
    const seq = Array.from({ length: numSeats }, (_, i) => i)
    if (r % 2 === 1) seq.reverse()
    order.push(...seq)
  }
  return order
}

function rngFor(seed: number, pickIndex: number): () => number {
  return makeRng((seed ^ ((pickIndex + 1) * 0x9e3779b1)) >>> 0)
}

export interface OfferCard extends CharacterVariant {
  fit: number
}

export function useDraft() {
  const [phase, setPhase] = useState<Phase>("menu")
  const [mode, setMode] = useState<GameMode>("solo")
  const [seed, setSeed] = useState<number>(0)
  const [picks, setPicks] = useState<Pick[]>([])
  const [transitionCard, setTransitionCard] = useState<{ card: DraftedCard; team: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState(PICK_SECONDS)
  const [reducedMotion, setReducedMotion] = useState(false)
  const busyRef = useRef(false)

  const seats = useMemo(() => buildSeats(mode), [mode])
  const draftOrder = useMemo(
    () => buildDraftOrder(seats.length, ROUNDS_PER_SEAT[mode]),
    [seats.length, mode],
  )
  const totalPicks = draftOrder.length

  const teams: TeamState[] = useMemo(() => {
    const byId = new Map<string, TeamState>()
    for (const s of seats) {
      if (!byId.has(s.teamId)) byId.set(s.teamId, { id: s.teamId, name: s.teamName, cards: [] })
    }
    for (const p of picks) byId.get(p.teamId)?.cards.push(p.card)
    return Array.from(byId.values())
  }, [seats, picks])

  const currentPickIndex = picks.length
  const isComplete = currentPickIndex >= totalPicks
  const currentSeat = isComplete ? null : seats[draftOrder[currentPickIndex]]
  const currentTeam = currentSeat ? teams.find((t) => t.id === currentSeat.teamId) : undefined

  const constraints: OfferConstraints = useMemo(
    () => ({
      usedCardIds: new Set(picks.map((p) => p.card.id)),
      usedBaseIds: new Set(picks.map((p) => p.card.baseCharacterId)),
    }),
    [picks],
  )

  const offer: OfferCard[] = useMemo(() => {
    if (phase !== "drafting" || isComplete) return []
    const raw = generateOffer(constraints, rngFor(seed, currentPickIndex))
    const teamCards = currentTeam?.cards ?? []
    return raw.map((c) => ({ ...c, fit: teamFit(c, teamCards) }))
  }, [phase, isComplete, constraints, seed, currentPickIndex, currentTeam, mode])

  const liveScores: Record<string, ScoreResult> = useMemo(() => {
    const out: Record<string, ScoreResult> = {}
    for (const t of teams) out[t.id] = scoreTeam(t.cards)
    return out
  }, [teams])

  // Detect reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Load saved game once.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as SavedGame
        if (saved.picks?.length >= 0 && saved.seed) {
          setMode(saved.mode)
          setSeed(saved.seed)
          setPicks(saved.picks)
          setPhase("drafting")
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Persist.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (phase === "menu") {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    const data: SavedGame = { mode, seed, picks }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [phase, mode, seed, picks])

  const commitPick = useCallback(
    (card: CharacterVariant) => {
      if (busyRef.current || !currentSeat) return
      busyRef.current = true
      const teamCards = teams.find((t) => t.id === currentSeat.teamId)?.cards ?? []
      const drafted: DraftedCard = { ...card, fitAtPick: teamFit(card, teamCards) }
      const pick: Pick = { seatIndex: currentSeat.index, teamId: currentSeat.teamId, card: drafted }

      const showTime = reducedMotion ? 500 : 1500
      setTransitionCard({ card: drafted, team: currentSeat.teamName })
      window.setTimeout(() => {
        setPicks((prev) => [...prev, pick])
        setTransitionCard(null)
        busyRef.current = false
      }, showTime)
    },
    [currentSeat, teams, reducedMotion],
  )

  // Auto-advance to results when complete.
  useEffect(() => {
    if (phase === "drafting" && isComplete && !transitionCard) {
      const t = window.setTimeout(() => setPhase("results"), reducedMotion ? 200 : 700)
      return () => window.clearTimeout(t)
    }
  }, [phase, isComplete, transitionCard, reducedMotion])

  // AI seat auto-picks.
  useEffect(() => {
    if (phase !== "drafting" || isComplete || transitionCard) return
    if (!currentSeat?.isAI) return
    const teamCards = teams.find((t) => t.id === currentSeat.teamId)?.cards ?? []
    const best = [...offer].sort((a, b) => teamFit(b, teamCards) - teamFit(a, teamCards))[0]
    if (!best) return
    const t = window.setTimeout(() => commitPick(best), reducedMotion ? 400 : 1100)
    return () => window.clearTimeout(t)
  }, [phase, isComplete, transitionCard, currentSeat, offer, teams, commitPick, reducedMotion])

  // Per-pick timer (human seats only). Auto-picks best fit at 0.
  useEffect(() => {
    if (phase !== "drafting" || isComplete || transitionCard || !currentSeat || currentSeat.isAI) {
      return
    }
    setTimeLeft(PICK_SECONDS)
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id)
          const best = [...offer].sort((a, b) => b.fit - a.fit)[0]
          if (best) commitPick(best)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, isComplete, transitionCard, currentSeat, currentPickIndex, offer, commitPick])

  const startGame = useCallback((m: GameMode) => {
    setMode(m)
    setSeed(randomSeed())
    setPicks([])
    setTransitionCard(null)
    setPhase("drafting")
  }, [])

  const pickCard = useCallback(
    (card: CharacterVariant) => {
      if (currentSeat && !currentSeat.isAI) commitPick(card)
    },
    [currentSeat, commitPick],
  )

  const undo = useCallback(() => {
    if (busyRef.current) return
    setPicks((prev) => prev.slice(0, -1))
    if (phase === "results") setPhase("drafting")
  }, [phase])

  const reset = useCallback(() => {
    setPicks([])
    setTransitionCard(null)
    setPhase("menu")
  }, [])

  const rematch = useCallback(() => {
    setSeed(randomSeed())
    setPicks([])
    setTransitionCard(null)
    setPhase("drafting")
  }, [])

  const finishEarly = useCallback(() => {
    if (picks.length > 0) setPhase("results")
  }, [picks.length])

  const roundsPerSeat = ROUNDS_PER_SEAT[mode]
  const currentRound = Math.floor(currentPickIndex / seats.length) + 1
  const remaining = remainingDraftable(constraints)

  return {
    phase,
    mode,
    seats,
    teams,
    offer,
    liveScores,
    currentSeat,
    currentTeam,
    currentPickIndex,
    totalPicks,
    currentRound,
    roundsPerSeat,
    isComplete,
    transitionCard,
    timeLeft,
    reducedMotion,
    remaining,
    canUndo: picks.length > 0,
    // actions
    startGame,
    pickCard,
    undo,
    reset,
    rematch,
    finishEarly,
  }
}
