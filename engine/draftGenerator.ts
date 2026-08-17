import type { CharacterVariant, Rarity } from "@/lib/types"
import { ROSTER } from "@/data/roster"
import { RARITY_ORDER, rollRarity } from "@/data/rarities"
import { pick } from "./rng"

export interface OfferConstraints {
  usedCardIds: Set<string> // exact variants already drafted or previously offered
  usedBaseIds: Set<string> // base characters already drafted (no second variant)
}

const OFFER_SIZE = 3

function availablePool(constraints: OfferConstraints): CharacterVariant[] {
  return ROSTER.filter(
    (c) => !constraints.usedCardIds.has(c.id) && !constraints.usedBaseIds.has(c.baseCharacterId),
  )
}

function pickOfRarity(
  pool: CharacterVariant[],
  rarity: Rarity,
  chosenBases: Set<string>,
  rng: () => number,
): CharacterVariant | null {
  const candidates = pool.filter((c) => c.rarity === rarity && !chosenBases.has(c.baseCharacterId))
  if (candidates.length === 0) return null
  return pick(candidates, rng)
}

// Find the nearest available rarity if the rolled one has no candidates left.
function nearestRarity(
  pool: CharacterVariant[],
  target: Rarity,
  chosenBases: Set<string>,
): Rarity | null {
  const idx = RARITY_ORDER.indexOf(target)
  for (let dist = 0; dist < RARITY_ORDER.length; dist++) {
    for (const dir of [-1, 1]) {
      const i = idx + dir * dist
      if (i < 0 || i >= RARITY_ORDER.length) continue
      const r = RARITY_ORDER[i]
      if (pool.some((c) => c.rarity === r && !chosenBases.has(c.baseCharacterId))) return r
    }
  }
  return null
}

/**
 * Generate a fresh 3-card offer. Guarantees:
 * - no duplicate variants across the offer
 * - no two cards sharing a base character within the offer
 * - respects already-drafted variants and base characters
 * - rarity driven by the configured probabilities, with a nudge away from
 *   three-identical-rarity offers.
 */
export function generateOffer(constraints: OfferConstraints, rng: () => number): CharacterVariant[] {
  const pool = availablePool(constraints)
  const offer: CharacterVariant[] = []
  const chosenBases = new Set<string>()

  // Roll rarities up front so we can nudge away from all-identical offers.
  const rarities: Rarity[] = [rollRarity(rng), rollRarity(rng), rollRarity(rng)]
  if (rarities[0] === rarities[1] && rarities[1] === rarities[2]) {
    rarities[2] = rollRarity(rng) // one extra roll for natural variety
  }

  for (let i = 0; i < OFFER_SIZE; i++) {
    if (pool.length - chosenBases.size <= 0) break
    let rarity: Rarity | null = rarities[i]
    if (!pool.some((c) => c.rarity === rarity && !chosenBases.has(c.baseCharacterId))) {
      rarity = nearestRarity(pool, rarity, chosenBases)
    }
    if (!rarity) break
    const card = pickOfRarity(pool, rarity, chosenBases, rng)
    if (!card) break
    offer.push(card)
    chosenBases.add(card.baseCharacterId)
  }

  return offer
}

export function remainingDraftable(constraints: OfferConstraints): number {
  const bases = new Set<string>()
  for (const c of availablePool(constraints)) bases.add(c.baseCharacterId)
  return bases.size
}
