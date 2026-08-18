"use client"

import { useState } from "react"
import type { DraftedCard } from "@/lib/types"
import type { useDraft } from "@/hooks/use-draft"
import { CharacterCard } from "./character-card"
import { CharacterPortrait } from "./character-portrait"
import { getIcon } from "@/lib/icon-map"
import { cn } from "@/lib/utils"

const TEAM_ACCENTS: Record<string, string> = {
  A: "oklch(0.62 0.2 22)",
  B: "oklch(0.62 0.16 250)",
}

const COMPOSITION = [
  ["POWER", (cards: DraftedCard[]) => (cards.length ? cards.reduce((sum, card) => sum + card.powerValue, 0) / cards.length : 0)],
  ["DURABILITY", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.some((tag) => ["Gamma", "Asgardian", "Super Soldier"].includes(tag))).length * 36],
  ["MOBILITY", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.some((tag) => ["Speedster", "Spider-Verse", "Cosmic"].includes(tag))).length * 34],
  ["RANGE", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.some((tag) => ["Cosmic", "Tech", "Mystic", "Magic"].includes(tag))).length * 30],
  ["CONTROL", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.some((tag) => ["Mystic", "Magic", "Telepath"].includes(tag))).length * 38],
  ["INTELLIGENCE", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.includes("Tech") || card.name === "Mister Fantastic").length * 42],
  ["ENERGY", (cards: DraftedCard[]) => cards.filter((card) => card.synergyTags.some((tag) => ["Cosmic", "Mystic", "Magic", "Gamma"].includes(tag))).length * 31],
  ["VERSATILITY", (cards: DraftedCard[]) => (cards.length ? new Set(cards.flatMap((card) => card.synergyTags)).size * 12 : 0)],
] as const

function composition(cards: DraftedCard[]) {
  return COMPOSITION.map(([label, getValue]) => ({
    label,
    value: Math.min(100, Math.round(getValue(cards))),
  }))
}

function needFor(cards: DraftedCard[]) {
  const lowest = composition(cards).sort((a, b) => a.value - b.value)[0]
  return lowest?.value < 55 ? lowest.label : undefined
}

function CompositionBars({ cards, accent }: { cards: DraftedCard[]; accent: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-foreground">Team composition</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live profile</span>
      </div>

      <div className="grid gap-2">
        {composition(cards).map(({ label, value }) => (
          <div key={label} className="grid grid-cols-[5.8rem_1fr] items-center gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </span>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${value}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function GhostRoster({ cards, slots }: { cards: DraftedCard[]; slots: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 top-8 z-0 flex items-center justify-center overflow-hidden opacity-25 sm:inset-x-10">
      <div className="flex max-w-[80%] items-center justify-center -space-x-7 sm:-space-x-10">
        {Array.from({ length: slots }).map((_, index) => {
          const card = cards[index]

          return card ? (
            <div
              key={card.id}
              className="relative aspect-[3/4] w-20 overflow-hidden rounded-xl border border-white/20 shadow-2xl sm:w-28"
            >
              <CharacterPortrait variant={card} compact />
            </div>
          ) : (
            <div
              key={index}
              className="aspect-[3/4] w-20 rounded-xl border border-dashed border-white/20 bg-white/[0.02] sm:w-28"
            />
          )
        })}
      </div>
    </div>
  )
}

export function DraftBoard({ game }: { game: ReturnType<typeof useDraft> }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const {
    mode,
    teams,
    offer,
    currentSeat,
    currentPickIndex,
    totalPicks,
    currentRound,
    roundsPerSeat,
    timeLeft,
    remaining,
    canUndo,
    reducedMotion,
    pickCard,
    undo,
    finishEarly,
    reset,
  } = game

  const Cpu = getIcon("cpu")
  const isAITurn = !!currentSeat?.isAI
  const accent = currentSeat ? TEAM_ACCENTS[currentSeat.teamId] : TEAM_ACCENTS.A
  const playerTeam = teams.find((team) => team.id === "A") ?? teams[0]
  const opponentTeam = teams.find((team) => team.id !== playerTeam?.id)
  const slots = roundsPerSeat * (mode === "2v2" ? 2 : 1)
  const playerNeed = needFor(playerTeam?.cards ?? [])
  const timeLow = timeLeft <= 10 && !isAITurn

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col gap-4 px-4 py-5 lg:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-card/55 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Exit
          </button>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-primary">
              Round {currentRound} / {roundsPerSeat}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              Pick {Math.min(currentPickIndex + 1, totalPicks)} of {totalPicks} · {remaining} heroes left
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: accent }}
          >
            {isAITurn && <Cpu className="h-4 w-4 animate-pulse" />}
            {currentSeat ? `${currentSeat.player} — On the Clock` : "Draft Complete"}
          </div>

          {!isAITurn && currentSeat && (
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-lg font-bold tabular-nums transition-colors",
                timeLow ? "animate-glow-pulse border-primary text-primary" : "border-border text-foreground",
              )}
            >
              {timeLeft}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="rounded-lg border border-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors enabled:hover:bg-secondary enabled:hover:text-foreground disabled:opacity-40"
          >
            Undo
          </button>

          <button
            type="button"
            onClick={finishEarly}
            className="rounded-lg bg-secondary px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            Finish
          </button>
        </div>
      </header>

      <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section
          aria-label="Available picks"
          className="relative min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_32%,rgba(153,35,44,0.24),transparent_32%),radial-gradient(circle_at_12%_88%,rgba(47,89,167,0.2),transparent_32%),linear-gradient(145deg,rgba(11,16,32,0.98),rgba(17,20,43,0.9))] px-4 py-6 sm:px-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:42px_42px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 shadow-[0_0_100px_rgba(220,38,38,0.12)]"
          />

          <GhostRoster cards={playerTeam?.cards ?? []} slots={slots} />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Persistent arena
              </p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                {isAITurn ? "Rival is choosing…" : "Choose your pick"}
              </h2>
            </div>

            <p className="hidden text-right text-xs text-muted-foreground sm:block">
              Your roster remains in the arena
              <br />
              while new offers materialize.
            </p>
          </div>

          <div
            className={cn(
              "relative z-10 mx-auto mt-24 grid w-full max-w-4xl grid-cols-3 items-start gap-3 sm:gap-5",
              isAITurn && "pointer-events-none opacity-60",
            )}
          >
            {offer.map((card, index) => (
              <CharacterCard
                key={card.id}
                card={card}
                index={index}
                animate={!reducedMotion}
                disabled={isAITurn}
                dimmed={hoveredId !== null && hoveredId !== card.id}
                teamNeed={playerNeed}
                onHoverChange={(hovered) => setHoveredId(hovered ? card.id : null)}
                onSelect={() => pickCard(card)}
              />
            ))}
          </div>

          <p className="relative z-10 mx-auto mt-20 max-w-md text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/75">
            Hover an offer to inspect its strengths and how it can address your roster.
          </p>
        </section>

        <aside className="flex flex-col gap-4">
          <CompositionBars cards={playerTeam?.cards ?? []} accent={TEAM_ACCENTS.A} />

          <section className="rounded-2xl border border-white/10 bg-card/45 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Your draft history
                </p>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                  {playerTeam?.name ?? "Your Team"}
                </h3>
              </div>

              <span className="font-display text-lg font-bold" style={{ color: TEAM_ACCENTS.A }}>
                {playerTeam ? playerTeam.cards.reduce((sum, card) => sum + card.powerValue, 0) : 0}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: slots }).map((_, index) => {
                const card = playerTeam?.cards[index]

                return card ? (
                  <div key={card.id} className="aspect-[3/4] overflow-hidden rounded-md border border-white/15">
                    <CharacterPortrait variant={card} compact />
                  </div>
                ) : (
                  <div
                    key={index}
                    className="aspect-[3/4] rounded-md border border-dashed border-white/15 bg-white/[0.03]"
                  />
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-card/35 p-4">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Opponent intel
            </p>

            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {Array.from({ length: slots }).map((_, index) => (
                <div
                  key={index}
                  className="flex aspect-[3/4] items-center justify-center rounded-md border border-dashed border-white/15 bg-white/[0.025] text-[10px] text-muted-foreground/50"
                >
                  ?
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {opponentTeam?.name ?? "Opponent"} remains concealed until results.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
