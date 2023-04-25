import { PageProps } from "src/app/types"
import PageWrapper from "src/components/PageWrapper"
import GameResult from "./GameResult"

export default function GameResultPage({ params }: PageProps) {
  const { gameId } = params
  return (
    <PageWrapper title="Resultat">
      <GameResult gameId={gameId} />
    </PageWrapper>
  )
}