"use client"

import type { CharacterVariant } from "@/lib/types"
import { RARITY_STYLES } from "@/data/rarities"
import { CharacterPortrait } from "./character-portrait"
import { cn } from "@/lib/utils"

function fitColor(fit: number) {
  if (fit >= 78) return "text-emerald-400"
  if (fit >= 55) return "text-amber-400"
  return "text-rose-400"
}
function fitBar(fit: number) {
  if (fit >= 78) return "bg-emerald-400"
  if (fit >= 55) return "bg-amber-400"
  return "bg-rose-400"
}

export function RarityBadge({ rarity, className = "" }: { rarity: CharacterVariant["rarity"]; className?: string }) {
  const s = RARITY_STYLES[rarity]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-display font-semibold uppercase tracking-widest",
        s.chip,
        className,
      )}
    >
      {s.label}
    </span>
  )
}

export function CharacterCard({
  card,
  fit,
  onSelect,
  disabled,
  index = 0,
  animate = true,
}: {
  card: CharacterVariant
  fit: number
  onSelect?: () => void
  disabled?: boolean
  index?: number
  animate?: boolean
}) {
  const s = RARITY_STYLES[card.rarity]

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{
        animationDelay: animate ? `${index * 120}ms` : undefined,
        // rarity glow
        ["--tw-shadow" as string]: s.glow,
      }}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300",
        "bg-card/70 backdrop-blur-sm card-sheen",
        s.border,
        animate && "animate-card-in",
        disabled
          ? "cursor-not-allowed opacity-45 grayscale"
          : "cursor-pointer hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-none",
      )}
    >
      {/* rarity glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px currentColor, ${s.glow}` }}
      />

      {/* Portrait */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
          <CharacterPortrait variant={card} />
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <RarityBadge rarity={card.rarity} />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">PWR</span>
          <span className="text-xs font-display font-bold text-white">{card.powerValue}</span>
        </div>

        {/* Name over image */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className={cn("font-display text-[11px] font-semibold uppercase tracking-[0.2em]", s.text)}>
            {card.variantName}
          </p>
          <h3 className="text-shadow-cine font-display text-2xl font-bold leading-none tracking-tight text-white">
            {card.name}
          </h3>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-1">
          {card.affiliations.slice(0, 2).map((a) => (
            <span key={a} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground/80">
              {a}
            </span>
          ))}
          {card.synergyTags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground/90 text-foreground/80">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Team Fit</span>
            <span className={cn("font-display text-sm font-bold", fitColor(fit))}>{fit}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className={cn("h-full rounded-full transition-all duration-500", fitBar(fit))} style={{ width: `${fit}%` }} />
          </div>
        </div>

        {!disabled && (
          <span className="mt-1 flex items-center justify-center rounded-lg bg-primary py-2 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors group-hover:bg-primary/90 group-focus-visible:bg-primary/90">
            Draft
          </span>
        )}
      </div>
    </button>
  )
}
