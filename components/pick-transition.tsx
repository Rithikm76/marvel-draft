"use client"

import type { DraftedCard } from "@/lib/types"
import { RARITY_STYLES } from "@/data/rarities"
import { CharacterPortrait } from "./character-portrait"
import { RarityBadge } from "./character-card"
import { cn } from "@/lib/utils"

export function PickTransition({ card, team }: { card: DraftedCard; team: string }) {
  const s = RARITY_STYLES[card.rarity]
  const isBig = card.rarity === "legendary" || card.rarity === "mythic"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background/85 backdrop-blur-md">
      {/* radial burst */}
      <div
        aria-hidden
        className="absolute inset-0 animate-burst"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${card.theme.glow}44 0%, transparent 55%)`,
        }}
      />
      {/* sweeping rays for high rarity */}
      {isBig && (
        <div
          aria-hidden
          className="absolute inset-0 animate-spin-slow opacity-30"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${card.theme.glow}55 20deg, transparent 40deg, transparent 180deg, ${card.theme.glow}55 200deg, transparent 220deg)`,
          }}
        />
      )}

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <p className="animate-fade-down font-display text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          {team} drafts
        </p>

        <div
          className={cn(
            "animate-card-reveal relative aspect-[3/4] w-56 overflow-hidden rounded-3xl border-2 sm:w-64",
            s.border,
          )}
          style={{ boxShadow: s.glow }}
        >
          <CharacterPortrait variant={card} />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className={cn("font-display text-xs font-semibold uppercase tracking-[0.2em]", s.text)}>
              {card.variantName}
            </p>
            <h2 className="text-shadow-cine font-display text-3xl font-bold leading-none tracking-tight text-white">
              {card.name}
            </h2>
          </div>
        </div>

        <div className="animate-fade-up">
          <RarityBadge rarity={card.rarity} className="scale-125" />
        </div>
      </div>
    </div>
  )
}
