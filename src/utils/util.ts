import { Timestamp } from "firebase/firestore";
import { Game } from "src/fire-base/models";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { CardItem } from "src/components/Card";
import { GameType, GroupInternal, WithId } from "../types/types";

export const testFunc = () => true;

export const generateMembershipDocumentId = (
  userId: string,
  groupId: string
): string => userId + "-" + groupId;

export const differenceBetweenFirestoreTimestampsInDays = (
  t1: Timestamp,
  t2: Timestamp
): number => {
  const unixTimestamp1 = t1.toMillis() / 1000;
  const unixTimestamp2 = t2.toMillis() / 1000;

  const secondsDiff = unixTimestamp2 - unixTimestamp1;
  const daysDiff = secondsDiff / (24 * 60 * 60);

  return Math.floor(daysDiff);
};

export const calculateDuration = (game: Game): number => {
  // Calculate duration between Game timestamp (when game started) and
  // current time. Duration is calculated in seconds.

  if (game.status === "ONGOING") {
    const startTime = new Date(game.timestamp.seconds).getTime();
    const currentTime = new Date().getTime();
    return Math.abs((currentTime - startTime) / 1000);
  }
  return game.duration || 0;
}

export const mapGroupsToCardItems = (
  groups: GroupInternal[],
  includeLabels: boolean,
  router: AppRouterInstance
): CardItem[] => {
  return groups.map((group) => {
    return {
      key: group.id,
      title: group.name,
      labels: includeLabels ? ["Noe relevant info", "Annen info"] : undefined,
      emoji: group.emoji,
      onClick: () => router.push(`/group/${group.id}`),
    };
  });
};

export const mapGameTypesToCardItems = (
  gameTypes?: GameType[],
  addGameTypeClickEvent?: () => void
) => {
  const gameTypeCards: CardItem[] = gameTypes
    ? gameTypes.map((gt) => ({
        key: gt.name,
        title: gt.name,
        emoji: gt.emoji,
      }))
    : [];

  return [
    {
      key: "new",
      title: "+ Legg til",
      onClick: () => addGameTypeClickEvent?.(),
    },
    ...gameTypeCards.sort((a, b) => a.title.localeCompare(b.title)),
  ];
};

export const mapGameToCardItem = (
  game: WithId<Game>,
) => {
  return {
    key: game.id,
    title: `${differenceBetweenFirestoreTimestampsInDays(Timestamp.fromMillis(game.duration ?? new Date()), Timestamp.fromDate(new Date()))} dager siden`,
    labels: [game.gameTypeId, `${game.winner} vant! 🎉`],
    emoji: game.gameTypeId,
  };
}

export const generatePincode = () => {
  const digits = "0123456789";
  let pin = "";
  for (let i = 0; i < 6; i++) {
    pin += digits[Math.floor(Math.random() * 10)];
  }
  return pin;  
}