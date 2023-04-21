"use client"

import Spinner from "src/components/Spinner"
import styles from "src/styles/GameResult.module.css"
import { Button, ButtonColor, ButtonVariant } from "src/components/Button"
import { CenteredSmallCards } from "src/components/CenteredSmallCards"
import { parseSeconds } from "src/utils/time"
import { CardItemSmall } from "src/components/Card"
import { useGetGameByIdWithAggregateData } from "src/services/game.service"
import { GameActionType } from "src/types/types"

export type GameResultProps = {
  gameId: string
}

export default function GameResult({ gameId }: GameResultProps) {
  const { loading, game } = useGetGameByIdWithAggregateData(gameId)

  if (!game && loading) return <Spinner />

  if (!game) return <p>Something went wrong!</p>

  const startDate = new Date((game.timestamp?.seconds ?? 0) * 1000)
  const { hours, minutes } = parseSeconds(7000 ?? 0)

  const timestampStr = Intl.DateTimeFormat("no").format(startDate)
  const durationStr = `${hours}:${minutes}`
  const groupNameStr = game.group ? `${game.group?.emoji} ${game.group?.name}` : null
  const gameTypeStr = game.gameTypeId + ""

  const items: CardItemSmall[] = [
    {
      key: "time",
      title: `${timestampStr} ${durationStr}`
    },
    {
      key: "game",
      title: gameTypeStr
    }
  ]

  if (groupNameStr) items.push({
    key: "group",
    title: groupNameStr
  })

  return (
    <div className={styles.wrapper}>
      <CenteredSmallCards items={items}/>
      <div className={styles["winner-wrapper"]}>
        <strong>Vinner 🎉</strong>
        <p>{JSON.stringify(game.winners)}</p>
      </div>
      <Button variant={ButtonVariant.Round} color={ButtonColor.Pink}>Tilbake til hjem</Button>
      <ul className={styles["actions-list"]}>
        {game.gameActions.map((gameAction, index) => {
          const actor = game.players.find(p => p.id === gameAction.actorId)
          const subject = game.players.find(p => p.id === gameAction.subjectId)

          const text = `
            ${actor?.username} 
            ${gameAction.actionType === GameActionType.ADD_POINTS ? `added ${gameAction.value} points for ${subject?.username}` : ""}
            ${gameAction.actionType === GameActionType.START ? "started the game" : ""}
            ${gameAction.actionType === GameActionType.FINISH ? "ended the game" : ""}
            ${gameAction.actionType === GameActionType.PAUSE ? "paused the game" : ""}
            ${gameAction.actionType === GameActionType.CONTINUE ? "continued the game" : ""}
          `

          return (
            <li key={`game-action-${index}`}>{text}</li>
          )
        })}
      </ul>
    </div>
  )
}