"use client"

import type { ActiveSynergy } from "@/lib/types"
import { getIcon } from "@/lib/icon-map"

export function SynergyPanel({ synergies }: { synergies: ActiveSynergy[] }) {
  if (synergies.length === 0) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">
        No synergies active yet. Draft heroes that share teams, origins, or roles to unlock bonuses.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {synergies.map((s) => {
        const Icon = getIcon(s.icon)
        return (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${s.color}22`, color: s.color }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-foreground">{s.name}</span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-bold"
                  style={{ backgroundColor: `${s.color}22`, color: s.color }}
                >
                  {s.tier}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{s.description}</p>
            </div>
            <span className="shrink-0 font-mono text-sm font-bold text-accent">+{s.bonus}</span>
          </li>
        )
      })}
    </ul>
  )
}
