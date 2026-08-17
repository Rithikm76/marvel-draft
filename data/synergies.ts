import type { Affiliation, SynergyTag } from "@/lib/types"

/**
 * Config-driven synergy rules. Icons are lucide-react icon keys (see lib/icon-map).
 * `coreBonus` fires once the team reaches `coreAt` members of that group and
 * represents a coherent team identity forming — this is what makes synergy
 * reward identity over simply stacking the same tag.
 */
export interface GroupSynergy {
  key: string
  label: string
  icon: string
  per: number // points per member after the first
  cap: number // max points from the per-member scaling
  coreAt: number // member count that unlocks the identity core bonus
  coreBonus: number
  coreLabel: string
}

export const AFFILIATION_SYNERGIES: Partial<Record<Affiliation, GroupSynergy>> = {
  Avengers: { key: "avengers", label: "Avengers Assembly", icon: "shield", per: 4, cap: 12, coreAt: 3, coreBonus: 18, coreLabel: "Avengers Core" },
  "X-Men": { key: "xmen", label: "X-Men Squad", icon: "zap", per: 4, cap: 12, coreAt: 3, coreBonus: 14, coreLabel: "Mutant Brotherhood" },
  Guardians: { key: "guardians", label: "Guardians Crew", icon: "rocket", per: 4, cap: 10, coreAt: 3, coreBonus: 12, coreLabel: "Guardians of the Galaxy" },
  "Fantastic Four": { key: "ff", label: "First Family", icon: "atom", per: 5, cap: 10, coreAt: 3, coreBonus: 16, coreLabel: "Fantastic Four" },
  Defenders: { key: "defenders", label: "Defenders", icon: "sword", per: 3, cap: 9, coreAt: 3, coreBonus: 10, coreLabel: "The Defenders" },
  Wakandan: { key: "wakandan", label: "Wakandan Allies", icon: "crown", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Wakandan Alliance" },
  "Midnight Sons": { key: "midnight", label: "Midnight Sons", icon: "moon", per: 4, cap: 8, coreAt: 2, coreBonus: 10, coreLabel: "Midnight Sons" },
  Symbiotes: { key: "symbiotes", label: "Symbiote Bond", icon: "biohazard", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Symbiote Hive" },
  Asgardian: { key: "asgardian", label: "Asgardian Court", icon: "hammer", per: 4, cap: 8, coreAt: 2, coreBonus: 9, coreLabel: "Realm of Asgard" },
  Brotherhood: { key: "brotherhood", label: "Brotherhood", icon: "flame", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Brotherhood of Mutants" },
  Illuminati: { key: "illuminati", label: "Illuminati", icon: "eye", per: 3, cap: 9, coreAt: 3, coreBonus: 11, coreLabel: "The Illuminati" },
  Thunderbolts: { key: "thunderbolts", label: "Thunderbolts", icon: "skull", per: 4, cap: 8, coreAt: 3, coreBonus: 10, coreLabel: "Thunderbolts" },
  "Young Avengers": { key: "young", label: "Young Avengers", icon: "star", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Young Avengers" },
  Eternals: { key: "eternals", label: "Eternals", icon: "infinity", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "The Eternals" },
}

export const TAG_SYNERGIES: Partial<Record<SynergyTag, GroupSynergy>> = {
  Cosmic: { key: "cosmic", label: "Cosmic Alignment", icon: "orbit", per: 3, cap: 9, coreAt: 3, coreBonus: 12, coreLabel: "Cosmic Team" },
  Tech: { key: "tech", label: "Tech Network", icon: "cpu", per: 3, cap: 9, coreAt: 3, coreBonus: 12, coreLabel: "Tech Network" },
  Mystic: { key: "mystic", label: "Mystic Coverage", icon: "sparkles", per: 3, cap: 8, coreAt: 2, coreBonus: 10, coreLabel: "Mystic Circle" },
  Magic: { key: "magic", label: "Arcane Weave", icon: "wand", per: 3, cap: 6, coreAt: 2, coreBonus: 6, coreLabel: "Arcane Coven" },
  Mutant: { key: "mutant", label: "Mutant Bond", icon: "dna", per: 3, cap: 9, coreAt: 3, coreBonus: 12, coreLabel: "Mutantkind" },
  "Spider-Verse": { key: "spiderverse", label: "Spider-Verse Network", icon: "webhook", per: 5, cap: 10, coreAt: 2, coreBonus: 15, coreLabel: "Spider-Verse Network" },
  "Street-Level": { key: "street", label: "Street-Level Crew", icon: "building", per: 3, cap: 9, coreAt: 3, coreBonus: 10, coreLabel: "Street-Level Team" },
  Symbiote: { key: "symbiote", label: "Symbiote Link", icon: "biohazard", per: 4, cap: 8, coreAt: 2, coreBonus: 9, coreLabel: "Symbiote Swarm" },
  Asgardian: { key: "asgardiant", label: "Asgardian Might", icon: "hammer", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Asgardian Pantheon" },
  Wakandan: { key: "wakandant", label: "Wakandan Tech", icon: "crown", per: 4, cap: 6, coreAt: 2, coreBonus: 6, coreLabel: "Wakandan Vanguard" },
  Gamma: { key: "gamma", label: "Gamma Force", icon: "radiation", per: 4, cap: 8, coreAt: 2, coreBonus: 8, coreLabel: "Gamma Powered" },
  Telepath: { key: "telepath", label: "Psionic Link", icon: "brain", per: 4, cap: 8, coreAt: 2, coreBonus: 9, coreLabel: "Psionic Network" },
  "Super Soldier": { key: "soldier", label: "Super Soldier Program", icon: "shield-half", per: 4, cap: 6, coreAt: 2, coreBonus: 6, coreLabel: "Super Soldiers" },
  "Martial Artist": { key: "martial", label: "Martial Discipline", icon: "swords", per: 2, cap: 8, coreAt: 3, coreBonus: 8, coreLabel: "Fighting Corps" },
}

// Named duo / trio pairings for extra flavor when relationships line up.
export interface NamedCombo {
  bases: string[]
  label: string
  icon: string
  bonus: number
}

export const NAMED_COMBOS: NamedCombo[] = [
  { bases: ["spider-man", "iron-man"], label: "Mentor & Protégé", icon: "handshake", bonus: 8 },
  { bases: ["thor", "hulk"], label: "Strongest Avengers", icon: "handshake", bonus: 7 },
  { bases: ["thor", "loki"], label: "Brothers of Asgard", icon: "handshake", bonus: 7 },
  { bases: ["captain-america", "iron-man"], label: "Cap & Iron Man", icon: "handshake", bonus: 6 },
  { bases: ["cyclops", "jean-grey"], label: "Cyclops & Jean", icon: "heart", bonus: 6 },
  { bases: ["jean-grey", "wolverine"], label: "Jean & Logan", icon: "heart", bonus: 5 },
  { bases: ["scarlet-witch", "vision"], label: "Wanda & Vision", icon: "heart", bonus: 7 },
  { bases: ["rogue", "gambit"], label: "Rogue & Gambit", icon: "heart", bonus: 6 },
  { bases: ["spider-man", "miles"], label: "Spider Brothers", icon: "handshake", bonus: 6 },
  { bases: ["star-lord", "gamora"], label: "Quill & Gamora", icon: "heart", bonus: 5 },
  { bases: ["rocket", "groot"], label: "Rocket & Groot", icon: "handshake", bonus: 6 },
  { bases: ["black-panther", "storm"], label: "Panther & Storm", icon: "heart", bonus: 6 },
  { bases: ["professor-x", "magneto"], label: "Xavier & Magneto", icon: "swords", bonus: 6 },
  { bases: ["scarlet-witch", "doctor-strange"], label: "Masters of Chaos & Order", icon: "handshake", bonus: 6 },
]

// Team identity descriptors derived from dominant groups.
export const IDENTITY_DESCRIPTIONS: Record<string, string> = {
  avengers: "A highly connected Avengers composition built around teamwork, tactics, and complementary combat styles.",
  xmen: "A tight mutant strike team leaning on shared training and raw genetic power.",
  guardians: "A ragtag cosmic crew that shouldn't work together — but absolutely does.",
  ff: "Earth's First Family: science, heart, and unshakable trust.",
  cosmic: "A star-spanning powerhouse operating on a universal scale.",
  tech: "A gadget-driven squad that wins through engineering and firepower.",
  mystic: "Guardians of the arcane, warding off threats from beyond reality.",
  spiderverse: "A web-slinging network of Spiders moving as one across the multiverse.",
  street: "Ground-level protectors who guard the city block by block.",
  mutant: "The next stage of human evolution, standing together.",
  mixed: "An eclectic alliance blending powers from across the Marvel universe.",
}
