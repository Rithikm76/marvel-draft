"use client"

import { useDraft } from "@/hooks/use-draft"
import { DraftMenu } from "@/components/draft-menu"
import { DraftBoard } from "@/components/draft-board"
import { DraftResults } from "@/components/draft-results"
import { PickTransition } from "@/components/pick-transition"

export default function Page() {
  const game = useDraft()

  return (
    <main className="relative min-h-dvh">
      {game.phase === "menu" && <DraftMenu onStart={game.startGame} />}
      {game.phase === "drafting" && <DraftBoard game={game} />}
      {game.phase === "results" && <DraftResults game={game} />}

      {game.transitionCard && (
        <PickTransition card={game.transitionCard.card} team={game.transitionCard.team} />
      )}
    </main>
  )
}
