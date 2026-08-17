import type { Affiliation, CharacterVariant, SynergyBreakdownItem, SynergyTag } from "@/lib/types"
import { AFFILIATION_SYNERGIES, NAMED_COMBOS, TAG_SYNERGIES, type GroupSynergy } from "@/data/synergies"

type Card = CharacterVariant

function groupCounts<T extends string>(cards: Card[], key: "affiliations" | "synergyTags") {
  const counts = new Map<T, number>()
  for (const c of cards) {
    for (const g of c[key] as T[]) {
      counts.set(g, (counts.get(g) ?? 0) + 1)
    }
  }
  return counts
}

function scoreGroup(count: number, cfg: GroupSynergy): SynergyBreakdownItem | null {
  if (count < 2) return null
  const scaling = Math.min(cfg.cap, (count - 1) * cfg.per)
  const core = count >= cfg.coreAt ? cfg.coreBonus : 0
  const points = scaling + core
  if (points <= 0) return null
  const label = count >= cfg.coreAt ? cfg.coreLabel : cfg.label
  return { label, icon: cfg.icon, points, kind: core > 0 ? "affiliation" : "tag" }
}

export interface SynergyResult {
  items: SynergyBreakdownItem[]
  penalties: SynergyBreakdownItem[]
  totalPoints: number
  topAffiliation?: string
  topTag?: string
  dominantKey: string
}

// Pure function of the team — deterministic.
export function computeSynergy(cards: Card[]): SynergyResult {
  const items: SynergyBreakdownItem[] = []
  const penalties: SynergyBreakdownItem[] = []

  const affCounts = groupCounts<Affiliation>(cards, "affiliations")
  const tagCounts = groupCounts<SynergyTag>(cards, "synergyTags")

  let topAffiliation: string | undefined
  let topAffCount = 0
  let dominantKey = "mixed"
  let dominantPoints = 0

  for (const [aff, count] of affCounts) {
    const cfg = AFFILIATION_SYNERGIES[aff]
    if (!cfg) continue
    const item = scoreGroup(count, cfg)
    if (item) {
      item.kind = "affiliation"
      items.push(item)
      if (item.points > dominantPoints) {
        dominantPoints = item.points
        dominantKey = cfg.key
      }
    }
    if (count > topAffCount) {
      topAffCount = count
      topAffiliation = aff
    }
  }

  let topTag: string | undefined
  let topTagCount = 0
  for (const [tag, count] of tagCounts) {
    const cfg = TAG_SYNERGIES[tag]
    if (!cfg) continue
    const item = scoreGroup(count, cfg)
    if (item) {
      item.kind = "tag"
      items.push(item)
      if (item.points > dominantPoints) {
        dominantPoints = item.points
        dominantKey = cfg.key
      }
    }
    if (count > topTagCount) {
      topTagCount = count
      topTag = tag
    }
  }

  // Named duo / trio combos (relationship-driven).
  const baseSet = new Set(cards.map((c) => c.baseCharacterId))
  for (const combo of NAMED_COMBOS) {
    if (combo.bases.every((b) => baseSet.has(b))) {
      items.push({ label: combo.label, icon: combo.icon, points: combo.bonus, kind: "duo" })
    }
  }

  // Relationship web: reward characters that list teammates present.
  let relationshipPoints = 0
  for (const c of cards) {
    for (const rel of c.relationships) {
      if (baseSet.has(rel)) relationshipPoints += 0.6
    }
  }
  relationshipPoints = Math.min(10, Math.round(relationshipPoints))
  if (relationshipPoints >= 2) {
    items.push({ label: "Established Bonds", icon: "network", points: relationshipPoints, kind: "relationship" })
  }

  // Anti-synergies (used sparingly): penalize a character whose antiSynergy tag
  // is a dominant theme of the rest of the team.
  for (const c of cards) {
    for (const anti of c.antiSynergies) {
      const cnt = tagCounts.get(anti) ?? 0
      if (cnt >= 2) {
        penalties.push({
          label: `${c.name} clashes with the team's ${anti} focus`,
          icon: "triangle-alert",
          points: -4,
          kind: "penalty",
        })
        break
      }
    }
  }

  const totalPoints =
    items.reduce((s, i) => s + i.points, 0) + penalties.reduce((s, i) => s + i.points, 0)

  return { items, penalties, totalPoints, topAffiliation, topTag, dominantKey }
}

// Raw synergy points only — used for fast Team Fit deltas.
export function synergyPoints(cards: Card[]): number {
  return computeSynergy(cards).totalPoints
}
