"use client"

import type { GameMode } from "@/lib/types"
import { getIcon } from "@/lib/icon-map"
import { cn } from "@/lib/utils"

const MODES: {
  id: GameMode
  name: string
  tagline: string
  detail: string
  icon: string
}[] = [
  {
    id: "solo",
    name: "Solo vs CPU",
    tagline: "6 picks each",
    detail: "Snake-draft against an AI rival that hunts for synergies. Outdraft the machine.",
    icon: "cpu",
  },
  {
    id: "1v1",
    name: "1v1 Local",
    tagline: "2 players · 6 picks",
    detail: "Pass-and-play head-to-head. Two managers alternate picks from a shared pool.",
    icon: "swords",
  },
  {
    id: "2v2",
    name: "2v2 Squads",
    tagline: "4 players · 3 picks",
    detail: "Two rosters, two drafters per side. Coordinate with your partner to build one team.",
    icon: "users",
  },
]

export function DraftMenu({ onStart }: { onStart: (mode: GameMode) => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-5 py-12">
      <div className="mb-10 text-center animate-fade-down">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.5em] text-primary">
          Assemble Your Roster
        </p>
        <h1 className="text-balance font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-foreground sm:text-8xl">
          Marvel
          <span className="block bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent">
            Draft
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Draft heroes and villains one pick at a time. Chain teams, origins, and powers into
          game-breaking synergies — then see how your squad scores.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {MODES.map((m, i) => {
          const Icon = getIcon(m.icon)
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onStart(m.id)}
              style={{ animationDelay: `${i * 120}ms` }}
              className={cn(
                "group animate-card-in relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card/60 p-6 text-left backdrop-blur-sm transition-all duration-300",
                "hover:-translate-y-1.5 hover:border-primary/60 focus-visible:-translate-y-1.5 focus-visible:border-primary/60 focus-visible:outline-none",
              )}
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary/25" />
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                  {m.name}
                </h2>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">{m.tagline}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{m.detail}</p>
              <span className="mt-auto flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                Start Draft
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-10 max-w-lg text-center text-xs leading-relaxed text-muted-foreground/70">
        A fan-made drafting game. Characters are referenced for fair, non-commercial play. Not
        affiliated with or endorsed by Marvel.
      </p>
    </div>
  )
}
