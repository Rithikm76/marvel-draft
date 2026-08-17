import type { Rarity } from "@/lib/types"

// Single source of truth for rarity probabilities (must sum to 1).
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 0.55,
  rare: 0.28,
  epic: 0.13,
  legendary: 0.04,
  mythic: 0.01,
}

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary", "mythic"]

// Small individual-value nudge per rarity (rarity != team fit, but rarer cards
// tend to be individually stronger). Kept intentionally modest.
export const RARITY_VALUE_BONUS: Record<Rarity, number> = {
  common: 0,
  rare: 3,
  epic: 7,
  legendary: 12,
  mythic: 18,
}

export interface RarityStyle {
  label: string
  text: string
  border: string
  glow: string
  chip: string
  ring: string
}

export const RARITY_STYLES: Record<Rarity, RarityStyle> = {
  common: {
    label: "Common",
    text: "text-zinc-300",
    border: "border-zinc-600/60",
    glow: "0 0 24px -6px rgba(161,161,170,0.45)",
    chip: "bg-zinc-700/70 text-zinc-100",
    ring: "ring-zinc-500/40",
  },
  rare: {
    label: "Rare",
    text: "text-sky-300",
    border: "border-sky-500/60",
    glow: "0 0 30px -4px rgba(56,189,248,0.55)",
    chip: "bg-sky-500/20 text-sky-200",
    ring: "ring-sky-400/50",
  },
  epic: {
    label: "Epic",
    text: "text-fuchsia-300",
    border: "border-fuchsia-500/60",
    glow: "0 0 34px -3px rgba(217,70,239,0.6)",
    chip: "bg-fuchsia-500/20 text-fuchsia-200",
    ring: "ring-fuchsia-400/50",
  },
  legendary: {
    label: "Legendary",
    text: "text-amber-300",
    border: "border-amber-400/70",
    glow: "0 0 42px -2px rgba(251,191,36,0.7)",
    chip: "bg-amber-400/20 text-amber-200",
    ring: "ring-amber-300/60",
  },
  mythic: {
    label: "Mythic",
    text: "text-rose-300",
    border: "border-rose-400/80",
    glow: "0 0 52px 0px rgba(244,63,94,0.8)",
    chip: "bg-rose-500/25 text-rose-100",
    ring: "ring-rose-300/70",
  },
}

export function rollRarity(rng: () => number): Rarity {
  const r = rng()
  let acc = 0
  for (const rarity of RARITY_ORDER) {
    acc += RARITY_WEIGHTS[rarity]
    if (r <= acc) return rarity
  }
  return "common"
}
