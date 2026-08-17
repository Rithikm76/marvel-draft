"use client"

import type { ScoreResult, TeamState } from "@/lib/types"
import { RARITY_STYLES } from "@/data/rarities"
import { CharacterPortrait } from "./character-portrait"
import { cn } from "@/lib/utils"

export function TeamRoster({
  team,
  score,
  slots,
  active,
  accent,
}: {
  team: TeamState
  score: ScoreResult
  slots: number
  active: boolean
  accent: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card/50 p-4 transition-all duration-300",
        active ? "border-transparent shadow-lg" : "border-border",
      )}
      style={active ? { boxShadow: `0 0 0 2px ${accent}, 0 0 32px -8px ${accent}` } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
            {team.name}
          </h3>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold leading-none" style={{ color: accent }}>
            {score.total}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Power</div>
        </div>
      </div>

      {team.cards.length > 0 && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {score.identity}
        </p>
      )}

      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: slots }).map((_, i) => {
          const card = team.cards[i]
          if (!card) {
            return (
              <div
                key={i}
                className="aspect-[3/4] rounded-md border border-dashed border-border/70 bg-secondary/30"
              />
            )
          }
          const s = RARITY_STYLES[card.rarity]
          return (
            <div
              key={card.id}
              className={cn("relative aspect-[3/4] overflow-hidden rounded-md border animate-card-in", s.border)}
              title={`${card.name} — ${card.variantName}`}
            >
              <CharacterPortrait variant={card} compact />
            </div>
          )
        })}
      </div>
    </div>
  )
}
