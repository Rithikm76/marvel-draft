import type { CharacterVariant, ScoreResult } from "@/lib/types"
import { RARITY_VALUE_BONUS } from "@/data/rarities"
import { IDENTITY_DESCRIPTIONS } from "@/data/synergies"
import { computeSynergy, synergyPoints } from "./synergyEngine"

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))

// Weighting: ~78% team synergy, ~22% individual value.
const SYNERGY_WEIGHT = 0.78
const VALUE_WEIGHT = 0.22

function synergyScoreFromPoints(points: number, teamSize: number): number {
  if (teamSize === 0) return 0
  const perCard = points / teamSize
  return clamp(Math.round((perCard / 14) * 100))
}

function valueScore(cards: CharacterVariant[]): number {
  if (cards.length === 0) return 0
  const avg =
    cards.reduce((s, c) => s + c.powerValue + RARITY_VALUE_BONUS[c.rarity], 0) / cards.length
  return clamp(Math.round(((avg - 60) / 45) * 100))
}

const TAG_WORD: Record<string, string> = {
  Tech: "Tech Network",
  Cosmic: "Cosmic Force",
  Mystic: "Mystic Order",
  Magic: "Arcane Circle",
  Mutant: "Mutant Alliance",
  "Spider-Verse": "Spider Network",
  "Street-Level": "Street Team",
  Gamma: "Gamma Squad",
  Symbiote: "Symbiote Hive",
  Asgardian: "Pantheon",
  Telepath: "Psi-Corps",
  "Martial Artist": "Fighting Corps",
  "Super Soldier": "Vanguard",
}

function buildIdentity(topAffiliation?: string, topTag?: string): string {
  if (topAffiliation && topTag) return `${topAffiliation} ${TAG_WORD[topTag] ?? "Alliance"}`
  if (topAffiliation) return `${topAffiliation} Alliance`
  if (topTag) return TAG_WORD[topTag] ?? `${topTag} Team`
  return "Assembled Team"
}

// Deterministic: same team -> same score.
export function scoreTeam(cards: CharacterVariant[]): ScoreResult {
  const syn = computeSynergy(cards)
  const synergyScore = synergyScoreFromPoints(syn.totalPoints, cards.length)
  const value = valueScore(cards)
  const total = clamp(Math.round(synergyScore * SYNERGY_WEIGHT + value * VALUE_WEIGHT))

  const strongest = [...syn.items].sort((a, b) => b.points - a.points).slice(0, 5)
  const weakLinks = [...syn.penalties]
  if (weakLinks.length === 0 && cards.length >= 3 && synergyScore < 55) {
    weakLinks.push({
      label: "Loosely connected roster — few shared teams or themes",
      icon: "triangle-alert",
      points: -0,
      kind: "penalty",
    })
  }

  const identity = buildIdentity(syn.topAffiliation, syn.topTag)
  const description = IDENTITY_DESCRIPTIONS[syn.dominantKey] ?? IDENTITY_DESCRIPTIONS.mixed

  return {
    total,
    synergyScore,
    valueScore: value,
    breakdown: syn.items,
    strongest,
    weakLinks,
    identity,
    description,
  }
}

/**
 * Team Fit: how much better the team becomes by adding this card, mapped to 0-100.
 * Blends the marginal synergy delta with the card's own value so the number is
 * meaningful even for the very first pick.
 */
export function teamFit(card: CharacterVariant, current: CharacterVariant[]): number {
  const cardValue = clamp(Math.round(((card.powerValue + RARITY_VALUE_BONUS[card.rarity] - 60) / 45) * 100))

  if (current.length === 0) {
    // No team yet: fit is mostly about individual value with a small baseline.
    return clamp(Math.round(50 + cardValue * 0.3))
  }

  const before = synergyPoints(current)
  const after = synergyPoints([...current, card])
  const delta = after - before // marginal synergy points from this card

  // Map delta (typically 0-20) to a 0-100 synergy-fit, then blend with value.
  const synFit = clamp(Math.round((delta / 16) * 100))
  const fit = Math.round(synFit * 0.75 + cardValue * 0.25)
  return clamp(fit, 8, 99)
}
