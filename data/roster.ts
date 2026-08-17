import type { Affiliation, CardTheme, CharacterVariant, Rarity, SynergyTag } from "@/lib/types"

/**
 * Data-driven roster.
 * Add a new base character with `base(...)` and list its variants — no UI changes needed.
 */

const THEMES = {
  asgard: { from: "#1e3a8a", via: "#f59e0b", to: "#0b1220", glow: "#fbbf24", emblem: "T" },
  loki: { from: "#065f46", via: "#facc15", to: "#0b1220", glow: "#34d399", emblem: "L" },
  tech: { from: "#7f1d1d", via: "#f59e0b", to: "#111827", glow: "#f97316", emblem: "IM" },
  ultron: { from: "#374151", via: "#ef4444", to: "#0b0f19", glow: "#f87171", emblem: "U" },
  spider: { from: "#b91c1c", via: "#2563eb", to: "#0b1220", glow: "#3b82f6", emblem: "SM" },
  miles: { from: "#0f172a", via: "#dc2626", to: "#000000", glow: "#ef4444", emblem: "MM" },
  gwen: { from: "#0e7490", via: "#f472b6", to: "#0b1220", glow: "#f472b6", emblem: "GW" },
  symbiote: { from: "#111827", via: "#e5e7eb", to: "#000000", glow: "#a3a3a3", emblem: "V" },
  gamma: { from: "#14532d", via: "#84cc16", to: "#0b1220", glow: "#65a30d", emblem: "H" },
  soldier: { from: "#1e3a8a", via: "#dc2626", to: "#0b1220", glow: "#3b82f6", emblem: "CA" },
  claw: { from: "#78350f", via: "#eab308", to: "#111827", glow: "#f59e0b", emblem: "WL" },
  chaos: { from: "#7f1d1d", via: "#db2777", to: "#0b0714", glow: "#ec4899", emblem: "SW" },
  mystic: { from: "#134e4a", via: "#f97316", to: "#0b1220", glow: "#2dd4bf", emblem: "DS" },
  phoenix: { from: "#7c2d12", via: "#f59e0b", to: "#450a0a", glow: "#f97316", emblem: "PX" },
  cosmic: { from: "#4c1d95", via: "#a855f7", to: "#0b0714", glow: "#c084fc", emblem: "C" },
  gold: { from: "#78350f", via: "#fcd34d", to: "#111827", glow: "#fbbf24", emblem: "G" },
  panther: { from: "#1e1b4b", via: "#7c3aed", to: "#000000", glow: "#8b5cf6", emblem: "BP" },
  storm: { from: "#0c4a6e", via: "#e0f2fe", to: "#0b1220", glow: "#7dd3fc", emblem: "ST" },
  magneto: { from: "#450a0a", via: "#a855f7", to: "#111827", glow: "#c084fc", emblem: "M" },
  street: { from: "#450a0a", via: "#b91c1c", to: "#000000", glow: "#ef4444", emblem: "DD" },
  guardians: { from: "#14532d", via: "#f97316", to: "#0b0714", glow: "#22c55e", emblem: "GG" },
  ff: { from: "#1e3a8a", via: "#38bdf8", to: "#0b1220", glow: "#60a5fa", emblem: "FF" },
  mutant: { from: "#312e81", via: "#f59e0b", to: "#0b1220", glow: "#818cf8", emblem: "X" },
  doom: { from: "#052e16", via: "#a3a3a3", to: "#0b0f19", glow: "#4ade80", emblem: "DD" },
  witch: { from: "#4c1d95", via: "#22d3ee", to: "#0b0714", glow: "#67e8f9", emblem: "SW" },
} satisfies Record<string, CardTheme>

interface BaseDef {
  base: string
  affiliations: Affiliation[]
  synergyTags: SynergyTag[]
  relationships: string[]
  antiSynergies?: SynergyTag[]
  theme: CardTheme
  source?: string
}

interface VariantDef {
  name: string
  variant: string
  rarity: Rarity
  power: number
  desc: string
  addTags?: SynergyTag[]
  addAffil?: Affiliation[]
  emblem?: string
}

function base(def: BaseDef, variants: VariantDef[]): CharacterVariant[] {
  return variants.map((vr, i) => ({
    id: `${def.base}-${i}`,
    baseCharacterId: def.base,
    name: vr.name,
    variantName: vr.variant,
    rarity: vr.rarity,
    description: vr.desc,
    powerValue: vr.power,
    affiliations: [...def.affiliations, ...(vr.addAffil ?? [])],
    synergyTags: [...def.synergyTags, ...(vr.addTags ?? [])],
    relationships: def.relationships,
    antiSynergies: def.antiSynergies ?? [],
    source: def.source ?? "Marvel Multiverse",
    theme: vr.emblem ? { ...def.theme, emblem: vr.emblem } : def.theme,
  }))
}

export const ROSTER: CharacterVariant[] = [
  ...base(
    { base: "thor", affiliations: ["Avengers", "Asgardian"], synergyTags: ["Asgardian", "Cosmic"], relationships: ["loki", "hulk", "iron-man", "captain-america"], theme: THEMES.asgard },
    [
      { name: "Thor", variant: "Mjolnir", rarity: "rare", power: 88, desc: "The Odinson wields the enchanted hammer, worthy and unstoppable." },
      { name: "Thor", variant: "Stormbreaker", rarity: "epic", power: 92, desc: "A new axe forged in a dying star, capable of summoning the Bifrost." },
      { name: "Thor", variant: "Infinity War", rarity: "rare", power: 89, desc: "Battle-scarred and vengeful, hunting Thanos across the cosmos." },
      { name: "Thor", variant: "Endgame", rarity: "common", power: 80, desc: "Worn but still worthy — thunder never truly fades." },
      { name: "Thor", variant: "Rune King", rarity: "mythic", power: 99, desc: "Ascended beyond godhood, wielding the Odin-Force and the runes of creation.", addTags: ["Mystic", "Cosmic Threat"] },
      { name: "Thor", variant: "Herald of Galactus", rarity: "legendary", power: 96, desc: "Empowered by the Power Cosmic to herald the world-eater.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "spider-man", affiliations: ["Avengers", "Spider-Verse"], synergyTags: ["Spider-Verse", "Street-Level"], relationships: ["iron-man", "miles", "spider-gwen", "daredevil"], theme: THEMES.spider },
    [
      { name: "Spider-Man", variant: "Classic", rarity: "common", power: 74, desc: "Friendly neighborhood Spider-Man with wits and webbing." },
      { name: "Spider-Man", variant: "Iron Spider", rarity: "epic", power: 84, desc: "Stark-built nanotech suit with waldoes and instant-kill mode.", addTags: ["Tech"], addAffil: ["Avengers"] },
      { name: "Spider-Man", variant: "Black Suit", rarity: "rare", power: 80, desc: "The alien suit boosts his power — at a hidden cost.", addTags: ["Symbiote"] },
      { name: "Spider-Man", variant: "Symbiote", rarity: "epic", power: 86, desc: "Fully bonded to the symbiote, aggressive and relentless.", addTags: ["Symbiote"] },
      { name: "Spider-Man", variant: "Advanced Suit", rarity: "common", power: 76, desc: "The sleek white-spider suit built for the modern city." },
      { name: "Spider-Man", variant: "Captain Universe", rarity: "mythic", power: 98, desc: "Bonded with the Uni-Power, granting near-limitless cosmic ability.", addTags: ["Cosmic"] },
    ],
  ),
  ...base(
    { base: "miles", affiliations: ["Spider-Verse", "Young Avengers"], synergyTags: ["Spider-Verse", "Street-Level"], relationships: ["spider-man", "spider-gwen"], theme: THEMES.miles },
    [{ name: "Miles Morales", variant: "Ultimate", rarity: "epic", power: 82, desc: "Bio-electric venom blast and camouflage set this Spider apart." }],
  ),
  ...base(
    { base: "spider-gwen", affiliations: ["Spider-Verse"], synergyTags: ["Spider-Verse", "Street-Level"], relationships: ["spider-man", "miles"], theme: THEMES.gwen },
    [{ name: "Spider-Gwen", variant: "Ghost-Spider", rarity: "epic", power: 81, desc: "Gwen Stacy of Earth-65, swinging with acrobatic precision." }],
  ),
  ...base(
    { base: "iron-man", affiliations: ["Avengers", "Illuminati"], synergyTags: ["Tech"], relationships: ["spider-man", "captain-america", "hulk", "vision"], theme: THEMES.tech },
    [
      { name: "Iron Man", variant: "Mark 3", rarity: "common", power: 78, desc: "The gold-titanium classic that started the legend." },
      { name: "Iron Man", variant: "Mark 46", rarity: "rare", power: 84, desc: "Civil War era armor, agile and combat-refined." },
      { name: "Iron Man", variant: "Mark 50", rarity: "epic", power: 90, desc: "Nanotech Bleeding Edge armor with modular weaponry." },
      { name: "Iron Man", variant: "Endgame", rarity: "legendary", power: 95, desc: "Wielded the Infinity Stones to save the universe.", addTags: ["Cosmic"] },
      { name: "Iron Man", variant: "Hulkbuster", rarity: "epic", power: 91, desc: "Veronica-deployed heavy armor built to go toe-to-toe with a Hulk.", addTags: ["Gamma"] },
    ],
  ),
  ...base(
    { base: "hulk", affiliations: ["Avengers", "Defenders"], synergyTags: ["Gamma"], relationships: ["thor", "iron-man", "captain-america"], theme: THEMES.gamma },
    [
      { name: "Hulk", variant: "Savage", rarity: "rare", power: 90, desc: "The angrier he gets, the stronger he gets. Pure rage." },
      { name: "Hulk", variant: "Professor", rarity: "epic", power: 88, desc: "Banner's intellect in the Hulk's body — best of both.", addTags: ["Tech"] },
      { name: "Hulk", variant: "World Breaker", rarity: "legendary", power: 97, desc: "Fueled by cosmic betrayal, strong enough to crack a planet.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "captain-america", affiliations: ["Avengers"], synergyTags: ["Super Soldier", "Street-Level"], relationships: ["iron-man", "thor", "black-widow", "winter-soldier"], theme: THEMES.soldier },
    [
      { name: "Captain America", variant: "WWII", rarity: "common", power: 75, desc: "The first Avenger storming the beaches with the star-spangled shield." },
      { name: "Captain America", variant: "Classic", rarity: "rare", power: 82, desc: "The unwavering leader and moral compass of the Avengers." },
      { name: "Captain America", variant: "Winter Soldier", rarity: "rare", power: 84, desc: "SHIELD-era tactician at the peak of his game." },
      { name: "Captain America", variant: "Endgame", rarity: "legendary", power: 93, desc: "Worthy of Mjolnir — 'Avengers, assemble.'", addTags: ["Asgardian"] },
    ],
  ),
  ...base(
    { base: "wolverine", affiliations: ["X-Men"], synergyTags: ["Mutant", "Street-Level", "Martial Artist"], relationships: ["cyclops", "jean-grey", "storm", "rogue"], theme: THEMES.claw },
    [
      { name: "Wolverine", variant: "Classic", rarity: "rare", power: 85, desc: "Adamantium claws, healing factor, and a bad attitude." },
      { name: "Wolverine", variant: "Weapon X", rarity: "epic", power: 88, desc: "The berserker product of the Weapon X program." },
      { name: "Wolverine", variant: "Old Man Logan", rarity: "epic", power: 87, desc: "A weathered future Logan who has seen the heroes fall." },
      { name: "Wolverine", variant: "Phoenix Force", rarity: "legendary", power: 95, desc: "Bonded to the Phoenix Force — claws wreathed in cosmic fire.", addTags: ["Cosmic", "Telepath"] },
    ],
  ),
  ...base(
    { base: "scarlet-witch", affiliations: ["Avengers", "Midnight Sons"], synergyTags: ["Magic", "Mystic", "Mutant"], relationships: ["vision", "doctor-strange", "magneto"], theme: THEMES.chaos },
    [
      { name: "Scarlet Witch", variant: "MCU", rarity: "epic", power: 89, desc: "Grief-forged chaos magic strong enough to rewrite a town." },
      { name: "Scarlet Witch", variant: "Darkhold", rarity: "legendary", power: 96, desc: "The Scarlet Witch of prophecy, corrupted by the Book of the Damned.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "doctor-strange", affiliations: ["Avengers", "Defenders", "Midnight Sons", "Illuminati"], synergyTags: ["Mystic", "Magic"], relationships: ["scarlet-witch", "wong", "iron-man"], theme: THEMES.mystic },
    [
      { name: "Doctor Strange", variant: "MCU", rarity: "epic", power: 88, desc: "Time Stone bearer who saw fourteen million futures." },
      { name: "Doctor Strange", variant: "Sorcerer Supreme", rarity: "legendary", power: 95, desc: "The undisputed defender of Earth's dimension.", addTags: ["Cosmic"] },
    ],
  ),
  ...base(
    { base: "jean-grey", affiliations: ["X-Men"], synergyTags: ["Mutant", "Telepath"], relationships: ["cyclops", "wolverine", "professor-x", "storm"], theme: THEMES.phoenix },
    [
      { name: "Jean Grey", variant: "Marvel Girl", rarity: "rare", power: 82, desc: "Telekinetic and telepathic prodigy of the X-Men." },
      { name: "Jean Grey", variant: "Phoenix", rarity: "epic", power: 92, desc: "Host to the Phoenix Force — creation and destruction incarnate.", addTags: ["Cosmic"] },
      { name: "Jean Grey", variant: "Dark Phoenix", rarity: "mythic", power: 99, desc: "The Phoenix unbound, a cosmic firestorm consuming stars.", addTags: ["Cosmic", "Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "venom", affiliations: ["Symbiotes", "Defenders"], synergyTags: ["Symbiote", "Street-Level"], relationships: ["spider-man"], antiSynergies: ["Super Soldier"], theme: THEMES.symbiote },
    [
      { name: "Venom", variant: "Eddie Brock", rarity: "rare", power: 84, desc: "Lethal protector bonded to the Klyntar symbiote." },
      { name: "Anti-Venom", variant: "Cleansing", rarity: "epic", power: 86, desc: "A healing white symbiote that purges corruption." },
      { name: "Venom", variant: "King in Black", rarity: "mythic", power: 98, desc: "Knull's dark champion, wielding the living abyss.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "loki", affiliations: ["Asgardian", "Young Avengers"], synergyTags: ["Asgardian", "Magic", "Mystic"], relationships: ["thor"], antiSynergies: ["Super Soldier"], theme: THEMES.loki },
    [
      { name: "Loki", variant: "Classic", rarity: "rare", power: 80, desc: "The God of Mischief, master of illusion and betrayal." },
      { name: "Loki", variant: "MCU", rarity: "rare", power: 81, desc: "Silver-tongued trickster on a redemption arc." },
      { name: "Loki", variant: "TVA", rarity: "epic", power: 85, desc: "A variant navigating the branches of the Sacred Timeline.", addTags: ["Cosmic"] },
      { name: "Loki", variant: "God of Stories", rarity: "legendary", power: 94, desc: "Holds the narrative of all realities in his hands.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "magneto", affiliations: ["Brotherhood", "X-Men"], synergyTags: ["Mutant"], relationships: ["scarlet-witch", "professor-x"], antiSynergies: ["Tech"], theme: THEMES.magneto },
    [
      { name: "Magneto", variant: "Classic", rarity: "rare", power: 88, desc: "Master of Magnetism and champion of mutantkind." },
      { name: "Magneto", variant: "Age of Apocalypse", rarity: "epic", power: 90, desc: "Leader of the X-Men in a world gone wrong." },
      { name: "Magneto", variant: "Empowered", rarity: "legendary", power: 95, desc: "Amplified magnetic mastery bending the planet's field.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "thanos", affiliations: ["Illuminati"], synergyTags: ["Cosmic", "Cosmic Threat", "Villain"], relationships: ["nebula", "gamora"], antiSynergies: ["Street-Level"], theme: THEMES.cosmic },
    [
      { name: "Thanos", variant: "Base", rarity: "epic", power: 92, desc: "The Mad Titan, a warlord obsessed with cosmic balance." },
      { name: "Thanos", variant: "Infinity Gauntlet", rarity: "mythic", power: 100, desc: "All six stones. A snap away from omnipotence.", addTags: ["Mystic"] },
    ],
  ),
  ...base(
    { base: "black-panther", affiliations: ["Avengers", "Wakandan", "Illuminati"], synergyTags: ["Wakandan", "Tech", "Street-Level", "Martial Artist"], relationships: ["storm", "shuri"], theme: THEMES.panther },
    [
      { name: "Black Panther", variant: "Classic", rarity: "rare", power: 84, desc: "T'Challa, king of Wakanda and the Panther god's chosen." },
      { name: "Black Panther", variant: "MCU", rarity: "epic", power: 86, desc: "Vibranium nanosuit that stores and redirects kinetic energy." },
      { name: "Black Panther", variant: "King of the Dead", rarity: "legendary", power: 93, desc: "Channeling every past Panther through the Astral Plane.", addTags: ["Mystic"] },
    ],
  ),
  ...base(
    { base: "storm", affiliations: ["X-Men", "Wakandan"], synergyTags: ["Mutant", "Wakandan"], relationships: ["black-panther", "cyclops", "jean-grey", "wolverine"], theme: THEMES.storm },
    [
      { name: "Storm", variant: "Classic", rarity: "rare", power: 83, desc: "Ororo Munroe commands the weather as a living goddess." },
      { name: "Storm", variant: "Goddess of Thunder", rarity: "epic", power: 89, desc: "Worshipped as a deity, wielding elemental fury.", addTags: ["Cosmic"] },
    ],
  ),
  ...base(
    { base: "cyclops", affiliations: ["X-Men"], synergyTags: ["Mutant"], relationships: ["jean-grey", "wolverine", "storm", "professor-x"], theme: THEMES.mutant },
    [
      { name: "Cyclops", variant: "Classic", rarity: "common", power: 78, desc: "Field leader of the X-Men with unerring optic blasts." },
      { name: "Cyclops", variant: "Phoenix Force", rarity: "epic", power: 90, desc: "A fragment of the Phoenix Force burning through his optic beams.", addTags: ["Cosmic"] },
    ],
  ),
  ...base(
    { base: "captain-marvel", affiliations: ["Avengers", "Guardians"], synergyTags: ["Cosmic"], relationships: ["iron-man", "thor"], theme: THEMES.gold },
    [
      { name: "Captain Marvel", variant: "Classic", rarity: "rare", power: 88, desc: "Carol Danvers, human-Kree hybrid powerhouse." },
      { name: "Captain Marvel", variant: "Binary", rarity: "epic", power: 93, desc: "Linked to a white hole, radiating stellar energy.", addTags: ["Cosmic Threat"] },
      { name: "Captain Marvel", variant: "MCU", rarity: "rare", power: 89, desc: "Photon-blasting, plane-flying cosmic protector." },
    ],
  ),
  ...base(
    { base: "black-widow", affiliations: ["Avengers"], synergyTags: ["Street-Level", "Martial Artist"], relationships: ["captain-america", "hawkeye"], theme: THEMES.street },
    [
      { name: "Black Widow", variant: "Classic", rarity: "common", power: 72, desc: "Master spy and unmatched hand-to-hand combatant." },
      { name: "Black Widow", variant: "MCU", rarity: "rare", power: 76, desc: "Red Room graduate turned Avenger, tactician supreme." },
    ],
  ),
  ...base(
    { base: "hawkeye", affiliations: ["Avengers"], synergyTags: ["Street-Level"], relationships: ["black-widow", "captain-america"], theme: THEMES.street },
    [
      { name: "Hawkeye", variant: "Classic", rarity: "common", power: 70, desc: "Never misses. A quiver for every situation." },
      { name: "Hawkeye", variant: "Ronin", rarity: "rare", power: 78, desc: "A darker, blade-wielding vigilante era." },
    ],
  ),
  ...base(
    { base: "ant-man", affiliations: ["Avengers", "Defenders"], synergyTags: ["Tech", "Street-Level"], relationships: ["wasp", "iron-man"], theme: THEMES.tech },
    [
      { name: "Ant-Man", variant: "Classic", rarity: "common", power: 71, desc: "Scott Lang shrinks and grows with Pym Particles." },
      { name: "Ant-Man", variant: "Giant", rarity: "rare", power: 80, desc: "Towering to skyscraper height in the Quantum Realm." },
    ],
  ),
  ...base(
    { base: "wasp", affiliations: ["Avengers"], synergyTags: ["Tech"], relationships: ["ant-man"], theme: THEMES.tech },
    [{ name: "Wasp", variant: "Hope van Dyne", rarity: "rare", power: 76, desc: "Winged, blaster-equipped, and combat-trained." }],
  ),
  ...base(
    { base: "vision", affiliations: ["Avengers"], synergyTags: ["Tech", "Mystic"], relationships: ["scarlet-witch", "iron-man", "ultron"], theme: THEMES.witch },
    [
      { name: "Vision", variant: "Classic", rarity: "rare", power: 85, desc: "Synthezoid powered by the Mind Stone, density-shifting android." },
      { name: "White Vision", variant: "Rebuilt", rarity: "epic", power: 87, desc: "The rebooted, emotionless synthezoid seeking his identity." },
    ],
  ),
  ...base(
    { base: "star-lord", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Street-Level"], relationships: ["gamora", "rocket", "groot", "drax"], theme: THEMES.guardians },
    [{ name: "Star-Lord", variant: "Peter Quill", rarity: "rare", power: 77, desc: "Half-Celestial outlaw leading the Guardians of the Galaxy." }],
  ),
  ...base(
    { base: "gamora", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Martial Artist"], relationships: ["star-lord", "nebula", "thanos", "drax"], theme: THEMES.guardians },
    [{ name: "Gamora", variant: "Deadliest Woman", rarity: "rare", power: 82, desc: "The galaxy's most lethal assassin, daughter of Thanos." }],
  ),
  ...base(
    { base: "rocket", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Tech"], relationships: ["groot", "star-lord"], theme: THEMES.guardians },
    [{ name: "Rocket", variant: "Weapons Expert", rarity: "rare", power: 74, desc: "A cybernetically enhanced raccoon with a very big gun." }],
  ),
  ...base(
    { base: "groot", affiliations: ["Guardians"], synergyTags: ["Cosmic"], relationships: ["rocket", "star-lord"], theme: THEMES.guardians },
    [
      { name: "Groot", variant: "Flora Colossus", rarity: "rare", power: 80, desc: "'I am Groot.' A regenerating tree of immense strength." },
      { name: "Baby Groot", variant: "Sapling", rarity: "common", power: 62, desc: "Small, adorable, and surprisingly dangerous." },
    ],
  ),
  ...base(
    { base: "drax", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Martial Artist"], relationships: ["star-lord", "gamora", "thanos"], theme: THEMES.guardians },
    [{ name: "Drax", variant: "The Destroyer", rarity: "common", power: 78, desc: "Built for one purpose: to destroy Thanos." }],
  ),
  ...base(
    { base: "nebula", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Tech"], relationships: ["gamora", "thanos"], theme: THEMES.guardians },
    [{ name: "Nebula", variant: "Cybernetic", rarity: "rare", power: 79, desc: "Relentless cyborg assassin, sister to Gamora." }],
  ),
  ...base(
    { base: "silver-surfer", affiliations: ["Defenders"], synergyTags: ["Cosmic", "Cosmic Threat"], relationships: ["galactus", "adam-warlock"], theme: THEMES.cosmic },
    [{ name: "Silver Surfer", variant: "Herald", rarity: "legendary", power: 95, desc: "Norrin Radd rides the spaceways wielding the Power Cosmic." }],
  ),
  ...base(
    { base: "ghost-rider", affiliations: ["Midnight Sons", "Defenders"], synergyTags: ["Mystic", "Magic", "Street-Level"], relationships: ["doctor-strange", "blade"], theme: THEMES.mystic },
    [
      { name: "Ghost Rider", variant: "Johnny Blaze", rarity: "epic", power: 87, desc: "The Spirit of Vengeance rides with hellfire and the Penance Stare." },
      { name: "Ghost Rider", variant: "Robbie Reyes", rarity: "rare", power: 82, desc: "A newer host bound to a very different, angrier spirit." },
    ],
  ),
  ...base(
    { base: "daredevil", affiliations: ["Defenders"], synergyTags: ["Street-Level", "Martial Artist"], relationships: ["spider-man", "punisher", "blade"], theme: THEMES.street },
    [
      { name: "Daredevil", variant: "Classic", rarity: "common", power: 74, desc: "The Man Without Fear, blind but radar-sensed." },
      { name: "Daredevil", variant: "Man Without Fear", rarity: "rare", power: 79, desc: "Hell's Kitchen's relentless guardian devil." },
    ],
  ),
  ...base(
    { base: "deadpool", affiliations: ["X-Men", "Thunderbolts"], synergyTags: ["Mutant", "Street-Level", "Martial Artist"], relationships: ["wolverine", "cable"], theme: THEMES.claw },
    [
      { name: "Deadpool", variant: "Classic", rarity: "rare", power: 80, desc: "The Merc with a Mouth — regenerating and unhinged." },
      { name: "Deadpool", variant: "X-Force", rarity: "epic", power: 83, desc: "Kitted for black-ops carnage with a smile." },
    ],
  ),
  ...base(
    { base: "punisher", affiliations: ["Defenders", "Thunderbolts"], synergyTags: ["Street-Level"], relationships: ["daredevil"], antiSynergies: ["Cosmic"], theme: THEMES.street },
    [{ name: "Punisher", variant: "Frank Castle", rarity: "common", power: 68, desc: "A one-man war on crime with an arsenal to match." }],
  ),
  ...base(
    { base: "moon-knight", affiliations: ["Midnight Sons", "Defenders"], synergyTags: ["Mystic", "Street-Level", "Martial Artist"], relationships: ["blade", "ghost-rider"], theme: THEMES.street },
    [{ name: "Moon Knight", variant: "Fist of Khonshu", rarity: "rare", power: 78, desc: "The avatar of the moon god, many faces, one vengeance." }],
  ),
  ...base(
    { base: "blade", affiliations: ["Midnight Sons", "Defenders"], synergyTags: ["Mystic", "Street-Level", "Martial Artist"], relationships: ["moon-knight", "ghost-rider"], theme: THEMES.street },
    [{ name: "Blade", variant: "Daywalker", rarity: "rare", power: 80, desc: "Half-vampire hunter with all the strengths and none of the weakness." }],
  ),
  ...base(
    { base: "professor-x", affiliations: ["X-Men", "Illuminati"], synergyTags: ["Mutant", "Telepath"], relationships: ["magneto", "jean-grey", "cyclops", "storm"], theme: THEMES.mutant },
    [
      { name: "Professor X", variant: "Classic", rarity: "epic", power: 86, desc: "The world's most powerful telepath and founder of the X-Men." },
      { name: "Professor X", variant: "Onslaught", rarity: "legendary", power: 96, desc: "A psionic entity born of Xavier and Magneto's darkest impulses.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "beast", affiliations: ["X-Men", "Illuminati"], synergyTags: ["Mutant", "Tech"], relationships: ["cyclops", "jean-grey"], theme: THEMES.mutant },
    [{ name: "Beast", variant: "Hank McCoy", rarity: "common", power: 76, desc: "Genius biochemist with feline agility and strength." }],
  ),
  ...base(
    { base: "nightcrawler", affiliations: ["X-Men"], synergyTags: ["Mutant", "Martial Artist"], relationships: ["storm", "rogue"], theme: THEMES.mutant },
    [{ name: "Nightcrawler", variant: "Bamf", rarity: "rare", power: 77, desc: "Teleporting swashbuckler with a heart of faith." }],
  ),
  ...base(
    { base: "rogue", affiliations: ["X-Men", "Brotherhood"], synergyTags: ["Mutant"], relationships: ["gambit", "wolverine", "storm"], theme: THEMES.mutant },
    [{ name: "Rogue", variant: "Power Absorption", rarity: "rare", power: 82, desc: "Absorbs abilities and memories with a single touch." }],
  ),
  ...base(
    { base: "gambit", affiliations: ["X-Men"], synergyTags: ["Mutant", "Street-Level"], relationships: ["rogue"], theme: THEMES.mutant },
    [{ name: "Gambit", variant: "Ragin' Cajun", rarity: "rare", power: 78, desc: "Charges objects with explosive kinetic energy." }],
  ),
  ...base(
    { base: "colossus", affiliations: ["X-Men"], synergyTags: ["Mutant"], relationships: ["wolverine", "storm"], theme: THEMES.mutant },
    [{ name: "Colossus", variant: "Organic Steel", rarity: "common", power: 79, desc: "Piotr Rasputin transforms into unbreakable living metal." }],
  ),
  ...base(
    { base: "iceman", affiliations: ["X-Men"], synergyTags: ["Mutant"], relationships: ["cyclops", "beast"], theme: THEMES.storm },
    [{ name: "Iceman", variant: "Omega", rarity: "epic", power: 85, desc: "An Omega-level mutant with total mastery over ice and cold.", addTags: ["Cosmic"] }],
  ),
  ...base(
    { base: "mister-fantastic", affiliations: ["Fantastic Four", "Illuminati"], synergyTags: ["Tech"], relationships: ["invisible-woman", "human-torch", "thing"], theme: THEMES.ff },
    [{ name: "Mister Fantastic", variant: "Reed Richards", rarity: "rare", power: 83, desc: "The smartest man alive, elastic in body and mind." }],
  ),
  ...base(
    { base: "invisible-woman", affiliations: ["Fantastic Four"], synergyTags: ["Tech"], relationships: ["mister-fantastic", "human-torch", "thing"], theme: THEMES.ff },
    [{ name: "Invisible Woman", variant: "Sue Storm", rarity: "epic", power: 85, desc: "Force fields and invisibility make her the FF's true powerhouse." }],
  ),
  ...base(
    { base: "human-torch", affiliations: ["Fantastic Four"], synergyTags: ["Tech"], relationships: ["mister-fantastic", "invisible-woman", "thing"], theme: THEMES.tech },
    [{ name: "Human Torch", variant: "Johnny Storm", rarity: "rare", power: 81, desc: "'Flame on!' Nova-blasting, sky-soaring hothead." }],
  ),
  ...base(
    { base: "thing", affiliations: ["Fantastic Four"], synergyTags: ["Street-Level"], relationships: ["mister-fantastic", "invisible-woman", "human-torch"], theme: THEMES.ff },
    [{ name: "The Thing", variant: "Ben Grimm", rarity: "rare", power: 84, desc: "'It's clobberin' time!' A mountain of rocky muscle." }],
  ),
  ...base(
    { base: "doctor-doom", affiliations: ["Illuminati"], synergyTags: ["Tech", "Mystic", "Magic", "Villain"], relationships: ["mister-fantastic"], theme: THEMES.doom },
    [
      { name: "Doctor Doom", variant: "Classic", rarity: "epic", power: 90, desc: "Monarch of Latveria, master of science AND sorcery." },
      { name: "Doctor Doom", variant: "Infamous", rarity: "legendary", power: 96, desc: "Doom ascendant, having briefly held godlike power.", addTags: ["Cosmic Threat"] },
    ],
  ),
  ...base(
    { base: "green-goblin", affiliations: ["Thunderbolts"], synergyTags: ["Tech", "Street-Level", "Villain"], relationships: ["spider-man"], theme: THEMES.gamma },
    [{ name: "Green Goblin", variant: "Norman Osborn", rarity: "rare", power: 80, desc: "Goblin-serum madness astride a razor-bat glider." }],
  ),
  ...base(
    { base: "ultron", affiliations: ["Thunderbolts"], synergyTags: ["Tech", "Villain", "Cosmic Threat"], relationships: ["vision", "iron-man"], antiSynergies: ["Mystic"], theme: THEMES.ultron },
    [{ name: "Ultron", variant: "Prime", rarity: "epic", power: 91, desc: "A genocidal AI in an adamantium body seeking 'peace.'" }],
  ),
  ...base(
    { base: "kang", affiliations: ["Illuminati"], synergyTags: ["Tech", "Cosmic", "Cosmic Threat", "Villain"], relationships: [], antiSynergies: ["Street-Level"], theme: THEMES.cosmic },
    [
      { name: "Kang", variant: "The Conqueror", rarity: "epic", power: 92, desc: "A time-traveling warlord from the 31st century." },
      { name: "Kang", variant: "Council of Kangs", rarity: "legendary", power: 96, desc: "Infinite variants across the multiverse, all him.", addTags: ["Mystic"] },
    ],
  ),
  ...base(
    { base: "galactus", affiliations: [], synergyTags: ["Cosmic", "Cosmic Threat", "Villain"], relationships: ["silver-surfer"], antiSynergies: ["Street-Level"], theme: THEMES.cosmic },
    [{ name: "Galactus", variant: "World Eater", rarity: "mythic", power: 100, desc: "A cosmic force of nature that devours planets to survive." }],
  ),
  ...base(
    { base: "adam-warlock", affiliations: ["Guardians"], synergyTags: ["Cosmic", "Mystic"], relationships: ["silver-surfer", "thanos"], theme: THEMES.gold },
    [{ name: "Adam Warlock", variant: "Perfect Being", rarity: "legendary", power: 94, desc: "Artificially perfected, wielder of the Soul Gem." }],
  ),
  ...base(
    { base: "sentry", affiliations: ["Avengers", "Thunderbolts"], synergyTags: ["Cosmic", "Cosmic Threat"], relationships: [], antiSynergies: ["Street-Level"], theme: THEMES.gold },
    [
      { name: "Sentry", variant: "Golden Guardian", rarity: "legendary", power: 97, desc: "The power of a million exploding suns — and a fractured mind." },
      { name: "The Void", variant: "Sentry's Shadow", rarity: "mythic", power: 99, desc: "Sentry's dark half, an apocalyptic force of destruction.", addTags: ["Villain"] },
    ],
  ),
  ...base(
    { base: "shang-chi", affiliations: ["Avengers", "Defenders"], synergyTags: ["Martial Artist", "Street-Level", "Mystic"], relationships: ["daredevil"], theme: THEMES.gold },
    [{ name: "Shang-Chi", variant: "Ten Rings", rarity: "epic", power: 86, desc: "The Master of Kung Fu wielding the legendary Ten Rings." }],
  ),
  ...base(
    { base: "nova", affiliations: ["Guardians"], synergyTags: ["Cosmic"], relationships: ["star-lord"], theme: THEMES.gold },
    [{ name: "Nova", variant: "Richard Rider", rarity: "epic", power: 85, desc: "Human rocket powered by the Nova Force of Xandar." }],
  ),
]

export const ROSTER_BY_ID: Record<string, CharacterVariant> = Object.fromEntries(
  ROSTER.map((c) => [c.id, c]),
)
