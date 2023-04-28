"use client"

import Spinner from "src/components/Spinner"
import styles from "src/styles/GameResult.module.css"
import { Button, ButtonColor, ButtonVariant } from "src/components/Button"
import { CenteredSmallCards } from "src/components/CenteredSmallCards"
import { parseSeconds } from "src/utils/time"
import { CardItemSmall } from "src/components/Card"
import { useGameData } from "src/services/game.service"
import { GameActionType } from "src/types/types"

export type GameResultProps = {
  gameId: string
}

export default function GameResult({ gameId }: GameResultProps) {
  const { game, loading } = useGameData(gameId)

  if (loading) return <Spinner />

  if (!game) return <p>Something went wrong!</p>

  const { hours, minutes } = parseSeconds(game.duration ?? 0)

  const timestampStr = Intl.DateTimeFormat("no").format(game.timestamp)
  const durationStr = `${hours}:${minutes}`
  const groupNameStr = game.group ? `${game.group?.emoji} ${game.group?.name}` : null
  const gameTypeStr = game.gameType

  const gameItems: CardItemSmall[] = [
    {
      key: "time",
      title: `${timestampStr} ${durationStr}`
    },
    {
      key: "game",
      title: gameTypeStr
    }
  ]

  const winnerItems: CardItemSmall[] = game.winners.map(winner => ({
    key: winner.id,
    title: winner.username
  }))

  if (groupNameStr) gameItems.push({
    key: "group",
    title: groupNameStr
  })

  return (
    <div className={styles.wrapper}>
      <CenteredSmallCards items={gameItems}/>
      <div className={styles["winner-wrapper"]}>
        <h2>Vinner 🎉</h2>
        <CenteredSmallCards items={winnerItems} />
      </div>
      <Button 
        variant={ButtonVariant.Round} 
        color={ButtonColor.Pink} 
        withLink={true} 
        href="/"
      >
        Tilbake til hjem
      </Button>
      <div>
        <h2>Leaderboard</h2>
        <div className={styles.leaderboard}>
        <div className={styles.grid}>
          <strong>Username</strong>
          <strong>Points</strong>
        </div>
        {game.players.map(player => (
          <div key={player.id} className={styles.grid}>
            <span>{player.username}</span>
            <span>{player.points}</span>
          </div>
        ))}
      </div>
      </div>
      <div>
        <h2>Logg</h2>
        <ul className={styles["actions-list"]}>
          {game.gameActions.map((action, index) => {
            const text = `
              ${action.actionType === GameActionType.ADD_POINTS ? `la til ${action.value} poeng for ${action.subject?.username}` : ""}
              ${action.actionType === GameActionType.START ? "startet spillet" : ""}
              ${action.actionType === GameActionType.FINISH ? "avsluttet spillet" : ""}
              ${action.actionType === GameActionType.PAUSE ? "satte spillet på pause" : ""}
              ${action.actionType === GameActionType.CONTINUE ? "fortsatte spillet" : ""}
            `
            return (
              <li key={`game-action-${index}`}><strong>{action.actor?.username}</strong> {text}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}