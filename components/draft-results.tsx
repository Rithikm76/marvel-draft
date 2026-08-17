"use client"

import { useMemo } from "react"
import type { useDraft } from "@/hooks/use-draft"
import type { ScoreResult, TeamState } from "@/lib/types"
import { CharacterPortrait } from "./character-portrait"
import { RarityBadge } from "./character-card"
import { RARITY_STYLES } from "@/data/rarities"
import { getIcon } from "@/lib/icon-map"
import { cn } from "@/lib/utils"

const TEAM_ACCENTS: Record<string, string> = {
  A: "oklch(0.62 0.2 22)",
  B: "oklch(0.62 0.16 250)",
}

function grade(total: number): { letter: string; label: string } {
  if (total >= 90) return { letter: "S", label: "Legendary Roster" }
  if (total >= 80) return { letter: "A", label: "Elite Squad" }
  if (total >= 68) return { letter: "B", label: "Strong Team" }
  if (total >= 55) return { letter: "C", label: "Solid Lineup" }
  if (total >= 40) return { letter: "D", label: "Rough Draft" }
  return { letter: "F", label: "Back to the Drawing Board" }
}

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-display font-bold text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: accent }} />
      </div>
    </div>
  )
}

function TeamResultCard({
  team,
  score,
  accent,
  winner,
}: {
  team: TeamState
  score: ScoreResult
  accent: string
  winner: boolean
}) {
  const g = grade(score.total)
  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur-sm",
        winner ? "border-transparent" : "border-border",
      )}
      style={winner ? { boxShadow: `0 0 0 2px ${accent}, 0 0 40px -10px ${accent}` } : undefined}
    >
      {winner && (
        <span
          className="absolute right-5 top-5 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: accent }}
        >
          Winner
        </span>
      )}

      <div className="flex items-center gap-4">
        <div
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl font-display leading-none"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <span className="text-4xl font-bold">{g.letter}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">{team.name}</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{g.label}</p>
          <p className="mt-1 font-display text-xs uppercase tracking-widest" style={{ color: accent }}>
            {score.identity}
          </p>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-5xl font-bold leading-none" style={{ color: accent }}>
            {score.total}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Power</div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{score.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <StatBar label="Synergy" value={score.synergyScore} accent={accent} />
        <StatBar label="Star Power" value={score.valueScore} accent={accent} />
      </div>

      {/* Roster */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {team.cards.map((card, i) => {
          const s = RARITY_STYLES[card.rarity]
          return (
            <div
              key={card.id}
              className={cn("group relative aspect-[3/4] overflow-hidden rounded-lg border animate-card-in", s.border)}
              style={{ animationDelay: `${i * 60}ms` }}
              title={`${card.name} — ${card.variantName}`}
            >
              <CharacterPortrait variant={card} compact />
              <div className="absolute inset-x-0 bottom-0 p-1.5">
                <p className="truncate font-display text-[10px] font-bold uppercase leading-tight text-white">
                  {card.name}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strengths & weak links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-emerald-400">
            Key Synergies
          </h3>
          <ul className="flex flex-col gap-1.5">
            {score.strongest.filter((b) => b.points > 0).slice(0, 4).map((b, i) => {
              const Icon = getIcon(b.icon)
              return (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground/90">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="flex-1 truncate">{b.label}</span>
                  <span className="font-mono text-xs text-emerald-400">+{b.points}</span>
                </li>
              )
            })}
            {score.strongest.filter((b) => b.points > 0).length === 0 && (
              <li className="text-sm text-muted-foreground">No standout synergies formed.</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-rose-400">
            Weak Links
          </h3>
          <ul className="flex flex-col gap-1.5">
            {score.weakLinks.length > 0 ? (
              score.weakLinks.slice(0, 4).map((b, i) => {
                const Icon = getIcon(b.icon)
                return (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                    <span className="flex-1">{b.label}</span>
                  </li>
                )
              })
            ) : (
              <li className="text-sm text-muted-foreground">No glaring weaknesses. Well-rounded roster.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function DraftResults({ game }: { game: ReturnType<typeof useDraft> }) {
  const { teams, liveScores, mode, rematch, reset, undo } = game

  const ranked = useMemo(
    () => [...teams].sort((a, b) => liveScores[b.id].total - liveScores[a.id].total),
    [teams, liveScores],
  )

  const isSolo = mode === "solo"
  const topScore = ranked.length ? liveScores[ranked[0].id].total : 0
  const tie = ranked.length > 1 && liveScores[ranked[0].id].total === liveScores[ranked[1].id].total

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="text-center animate-fade-down">
        <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.5em] text-primary">
          Draft Complete
        </p>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground sm:text-6xl">
          Final Verdict
        </h1>
        {!isSolo && (
          <p className="mt-3 text-lg text-muted-foreground">
            {tie ? "It's a dead heat — both teams tie!" : `${ranked[0].name} wins the draft.`}
          </p>
        )}
      </header>

      <div className={cn("grid gap-5", !isSolo && "lg:grid-cols-2")}>
        {ranked.map((team) => (
          <TeamResultCard
            key={team.id}
            team={team}
            score={liveScores[team.id]}
            accent={TEAM_ACCENTS[team.id]}
            winner={!isSolo && !tie && liveScores[team.id].total === topScore}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={rematch}
          className="rounded-xl bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Rematch
        </button>
        <button
          type="button"
          onClick={undo}
          className="rounded-xl border border-border px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
        >
          Undo Last Pick
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-border px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Main Menu
        </button>
      </div>
    </div>
  )
}
