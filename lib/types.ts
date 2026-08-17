export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic"

export type Affiliation =
  | "Avengers"
  | "X-Men"
  | "Guardians"
  | "Fantastic Four"
  | "Defenders"
  | "Thunderbolts"
  | "Young Avengers"
  | "Midnight Sons"
  | "Wakandan"
  | "Illuminati"
  | "Brotherhood"
  | "Symbiotes"
  | "Asgardian"
  | "Eternals"

export type SynergyTag =
  | "Cosmic"
  | "Mystic"
  | "Magic"
  | "Tech"
  | "Mutant"
  | "Spider-Verse"
  | "Street-Level"
  | "Symbiote"
  | "Asgardian"
  | "Wakandan"
  | "Gamma"
  | "Telepath"
  | "Super Soldier"
  | "Villain"
  | "Cosmic Threat"
  | "Speedster"
  | "Martial Artist"

// A visual theme drives the procedural character artwork.
export interface CardTheme {
  from: string
  via: string
  to: string
  glow: string
  emblem: string // short stylized emblem text drawn on the portrait
}

export interface CharacterVariant {
  id: string
  baseCharacterId: string
  name: string
  variantName: string
  rarity: Rarity
  description: string
  powerValue: number // 1-100 individual power
  affiliations: Affiliation[]
  synergyTags: SynergyTag[]
  relationships: string[] // baseCharacterIds this variant pairs well with
  antiSynergies: SynergyTag[] // tags this character clashes with
  source: string // universe / source label
  theme: CardTheme
}

export type GameMode = "solo" | "1v1" | "2v2"

export interface DraftedCard extends CharacterVariant {
  fitAtPick: number
}

export interface TeamState {
  id: string
  name: string
  cards: DraftedCard[]
}

export interface SynergyBreakdownItem {
  label: string
  icon: string
  points: number
  kind: "affiliation" | "tag" | "duo" | "relationship" | "penalty"
}

export interface ScoreResult {
  total: number // 0-100 final
  synergyScore: number // 0-100 team synergy portion
  valueScore: number // 0-100 individual value portion
  breakdown: SynergyBreakdownItem[]
  strongest: SynergyBreakdownItem[]
  weakLinks: SynergyBreakdownItem[]
  identity: string
  description: string
}
