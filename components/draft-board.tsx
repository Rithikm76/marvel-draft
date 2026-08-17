"use client"

import type { useDraft } from "@/hooks/use-draft"
import { CharacterCard } from "./character-card"
import { TeamRoster } from "./team-roster"
import { SynergyPanel } from "./synergy-panel"
import { getIcon } from "@/lib/icon-map"
import { cn } from "@/lib/utils"

const TEAM_ACCENTS: Record<string, string> = {
  A: "oklch(0.62 0.2 22)",
  B: "oklch(0.62 0.16 250)",
}

export function DraftBoard({ game }: { game: ReturnType<typeof useDraft> }) {
  const {
    mode,
    teams,
    offer,
    liveScores,
    currentSeat,
    currentTeam,
    currentPickIndex,
    totalPicks,
    currentRound,
    roundsPerSeat,
    timeLeft,
    remaining,
    canUndo,
    reducedMotion,
    pickCard,
    undo,
    finishEarly,
    reset,
  } = game

  const Cpu = getIcon("cpu")
  const isAITurn = !!currentSeat?.isAI
  const accent = currentSeat ? TEAM_ACCENTS[currentSeat.teamId] : TEAM_ACCENTS.A
  const timeLow = timeLeft <= 10 && !isAITurn
  const activeScore = currentTeam ? liveScores[currentTeam.id] : undefined

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col gap-4 px-4 py-5">
      {/* Top HUD */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Exit
          </button>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-primary">
              Round {currentRound} / {roundsPerSeat}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              Pick {Math.min(currentPickIndex + 1, totalPicks)} of {totalPicks} · {remaining} heroes left
            </p>
          </div>
        </div>

        {/* Turn indicator */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: accent }}
          >
            {isAITurn && <Cpu className="h-4 w-4 animate-pulse" />}
            {currentSeat ? `${currentSeat.player} — On the Clock` : "Draft Complete"}
          </div>
          {!isAITurn && currentSeat && (
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-lg font-bold tabular-nums transition-colors",
                timeLow ? "animate-glow-pulse border-primary text-primary" : "border-border text-foreground",
              )}
            >
              {timeLeft}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="rounded-lg border border-border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors enabled:hover:bg-secondary enabled:hover:text-foreground disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={finishEarly}
            className="rounded-lg bg-secondary px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            Finish
          </button>
        </div>
      </header>

      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Offer pool */}
        <section aria-label="Available picks" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
              {isAITurn ? "Rival is choosing…" : "Choose your pick"}
            </h2>
            <span className="text-xs text-muted-foreground">
              {mode === "2v2" ? "Shared pool · pick for your side" : "3 heroes offered"}
            </span>
          </div>

          <div
            className={cn(
              "mx-auto grid w-full max-w-3xl gap-4 transition-opacity duration-300 sm:grid-cols-3",
              isAITurn && "pointer-events-none opacity-60",
            )}
          >
            {offer.map((card, i) => (
              <CharacterCard
                key={card.id}
                card={card}
                fit={card.fit}
                index={i}
                animate={!reducedMotion}
                disabled={isAITurn}
                onSelect={() => pickCard(card)}
              />
            ))}
          </div>

          {/* Active team synergy readout */}
          {activeScore && currentTeam && (
            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                  {currentTeam.name} — Active Synergies
                </h3>
                <span className="font-display text-sm font-bold" style={{ color: accent }}>
                  {activeScore.total} PWR
                </span>
              </div>
              <SynergyPanel synergies={synergiesFromScore(activeScore)} />
            </div>
          )}
        </section>

        {/* Rosters / scoreboard */}
        <aside className="flex flex-col gap-4">
          {teams.map((team) => (
            <TeamRoster
              key={team.id}
              team={team}
              score={liveScores[team.id]}
              slots={roundsPerSeat * (mode === "2v2" ? 2 : 1)}
              active={currentSeat?.teamId === team.id}
              accent={TEAM_ACCENTS[team.id]}
            />
          ))}
        </aside>
      </div>
    </div>
  )
}

// Map a ScoreResult's positive breakdown into the SynergyPanel shape.
function synergiesFromScore(score: ReturnType<typeof import("@/engine/scoringEngine").scoreTeam>) {
  return score.strongest
    .filter((b) => b.points > 0)
    .map((b, i) => ({
      id: `${b.label}-${i}`,
      name: b.label,
      description: b.kind === "duo" || b.kind === "relationship" ? "Named pairing bonus" : "Team synergy",
      icon: b.icon,
      tier: b.points >= 14 ? "S" : b.points >= 9 ? "A" : b.points >= 5 ? "B" : "C",
      bonus: b.points,
      color: "oklch(0.72 0.15 85)",
    }))
}
