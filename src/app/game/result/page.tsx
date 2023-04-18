import { PageProps } from "src/app/types"
import PageWrapper from "src/components/PageWrapper"
import GameResult from "./GameResult"

export default function GameResultPage({ searchParams }: PageProps) {
  const { gameId } = searchParams
  return (
    <PageWrapper title="Resultat">
      <GameResult gameId={gameId} />
    </PageWrapper>
  )
}