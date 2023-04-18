"use client"

import { useEffect, useState } from "react"
import Spinner from "src/components/Spinner"
import { getDocument } from "src/fire-base/db"
import type { Game } from "src/fire-base/models"
import type { Document } from "src/fire-base/db"
import styles from "src/styles/GameResult.module.css"
import { Button, ButtonColor, ButtonVariant } from "src/components/Button"
import { CenteredSmallCards } from "src/components/CenteredSmallCards"
import { parseSeconds } from "src/utils/time"
import { CardItemSmall } from "src/components/Card"

export type GameResultProps = {
  gameId: string
}

export default function GameResult({ gameId }: GameResultProps) {
  const [game, setGame] = useState<Document<Game> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocument<Game>("games", gameId).then(setGame).then(() => setLoading(false))
  }, [gameId])

  if (!game && loading) return <Spinner />

  if (!game) return <p>Something went wrong!</p>

  const startDate = new Date(game.timestamp.seconds * 1000)
  const { hours, minutes } = parseSeconds(7000 ?? 0)

  const timestampStr = Intl.DateTimeFormat("no").format(startDate)
  const durationStr = `${hours}:${minutes}`
  const groupNameStr = null
  const gameTypeStr = "Tennis"

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
    </div>
  )
}