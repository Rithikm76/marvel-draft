"use client"

import { useState } from "react"

import type { CharacterVariant } from "@/lib/types"
import { RARITY_STYLES } from "@/data/rarities"
import { CharacterPortrait } from "./character-portrait"
import { cn } from "@/lib/utils"

function secondaryTraits(card: CharacterVariant) {
  const traits = new Set<string>()
  if (card.powerValue >= 86) traits.add("POWER")
  if (card.synergyTags.some((tag) => ["Mystic", "Magic", "Telepath"].includes(tag))) traits.add("CONTROL")
  if (card.synergyTags.some((tag) => ["Speedster", "Spider-Verse", "Cosmic"].includes(tag))) traits.add("MOBILITY")
  if (card.synergyTags.includes("Tech") || card.name === "Mister Fantastic") traits.add("INTELLIGENCE")
  if (card.synergyTags.some((tag) => ["Cosmic", "Tech", "Mystic", "Magic"].includes(tag))) traits.add("RANGE")
  if (card.synergyTags.length >= 3 || card.affiliations.length >= 2) traits.add("VERSATILITY")
  return Array.from(traits).slice(0, 4)
}

export function RarityBadge({ rarity, className = "" }: { rarity: CharacterVariant["rarity"]; className?: string }) {
  const s = RARITY_STYLES[rarity]

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-display font-semibold uppercase tracking-widest", s.chip, className)}>
      {s.label}
    </span>
  )
}

export function CharacterCard({
  card,
  onSelect,
  disabled,
  index = 0,
  animate = true,
  dimmed = false,
  teamNeed,
  onHoverChange,
}: {
  card: CharacterVariant
  onSelect?: () => void
  disabled?: boolean
  index?: number
  animate?: boolean
  dimmed?: boolean
  teamNeed?: string
  onHoverChange?: (hovered: boolean) => void
}) {
  const [touchDetails, setTouchDetails] = useState(false)
  const s = RARITY_STYLES[card.rarity]
  const traits = secondaryTraits(card)

  return (
    <button
      type="button"
      onClick={() => {
        if (window.matchMedia("(hover: none)").matches && !touchDetails) {
          setTouchDetails(true)
          return
        }
        onSelect?.()
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => {
        onHoverChange?.(false)
        setTouchDetails(false)
      }}
      disabled={disabled}
      style={{
        animationDelay: animate ? `${index * 140}ms` : undefined,
        ["--tw-shadow" as string]: s.glow,
      }}
      className={cn(
        "group relative z-10 flex w-full flex-col overflow-visible rounded-2xl border text-left transition-[transform,opacity,filter,box-shadow] duration-300",
        "bg-card/80 shadow-2xl backdrop-blur-md card-sheen",
        s.border,
        animate && "animate-card-in",
        dimmed && "scale-[0.96] opacity-45 saturate-50",
        disabled
          ? "cursor-not-allowed opacity-45 grayscale"
          : "cursor-pointer hover:z-30 hover:-translate-y-4 hover:scale-[1.035] focus-visible:z-30 focus-visible:-translate-y-4 focus-visible:scale-[1.035] focus-visible:outline-none",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px currentColor, 0 0 32px -5px currentColor, ${s.glow}` }}
      />

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110">
          <CharacterPortrait variant={card} />
        </div>

        <div className="absolute left-3 top-3">
          <RarityBadge rarity={card.rarity} />
        </div>

        <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-right backdrop-blur-sm">
          <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-white/55">Power</span>
          <span className="font-display text-base font-bold leading-none text-white">{card.powerValue}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className={cn("mb-1 font-display text-[10px] font-semibold uppercase tracking-[0.25em]", s.text)}>
            {card.variantName}
          </p>
          <h3 className="text-shadow-cine font-display text-2xl font-bold leading-none tracking-tight text-white">
            {card.name}
          </h3>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-[calc(100%+0.75rem)] z-40 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b1020]/95 p-3 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
          touchDetails && "translate-y-0 opacity-100",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Hero profile
          </span>
          <span className="font-display text-xs font-bold" style={{ color: card.theme.glow }}>
            {card.powerValue} POWER
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/90"
            >
              {trait}
            </span>
          ))}
        </div>

        {teamNeed && (
          <div className="mt-3 border-t border-white/10 pt-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your team needs
            </p>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-amber-300">
              {teamNeed} <span className="text-[10px] text-amber-300/70">· High need</span>
            </p>
          </div>
        )}
      </div>
    </button>
  )
}
