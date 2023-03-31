import { Timestamp } from "firebase/firestore";
import { Game } from "src/fire-base/models";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { CardItem } from "src/components/Card";
import { GameType } from "../fire-base/models";
import {
  GroupInternal,
  LeaderboardStats,
  Member,
  WithId,
} from "../types/types";

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

  console.log("utils", game, game.timestamp.toDate());

  if (game.status === "ONGOING") {
    const startTime = game.timestamp.toDate().getTime();
    const currentTime = new Date().getTime();
    return Math.abs((currentTime - startTime) / 1000);
  }
  return game.duration || 0;
};

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

export const calculateGroupLeaderboard = (
  members: Member[]
): LeaderboardStats[] => {
  const stats: LeaderboardStats[] = members.map((member) => {
    const gamesPlayed = member.wins + member.draws + member.losses;

    return {
      userId: member.userId,
      username: member.username,
      wins: member.wins,
      draws: member.draws,
      losses: member.losses,
      gamesPlayed,
      winRatio: gamesPlayed ? (member.wins / gamesPlayed) * 100 : 0,
    };
  });

  return stats.sort((a, b) => {
    const winRatioComparison = b.winRatio - a.winRatio;
    if (winRatioComparison !== 0) return winRatioComparison;

    const gamesPlayedComparison = b.gamesPlayed - a.gamesPlayed;
    if (gamesPlayedComparison !== 0) return gamesPlayedComparison;

    return a.username.localeCompare(b.username);
  });
};

export const mapGamesToCardItems = (
  games: WithId<Game>[],
  group: GroupInternal
): CardItem[] => {
  if (!games) return [];

  return games.map((game) => {
    const diffDays = differenceBetweenFirestoreTimestampsInDays(
      game.timestamp,
      Timestamp.fromDate(new Date())
    );

    const labels: string[] = [];

    const gameType = group.gameTypes?.find((gt) => gt.id === game.gameTypeId);
    if (gameType) {
      labels.push(`${gameType.name} ${gameType.emoji}`);
    }

    if (game.status === "ONGOING" && game.duration) {
      labels.push(`Spilt i ${game.duration.toFixed(0).toString()} sekunder`);
    }

    if (game.status === "FINISHED" && game.winner) {
      const winner = group.members.find((u) => u.userId === game.winner);
      if (winner) labels.push(`${winner.username} vant! 🎉`);
    }

    return {
      key: game.id,
      title: diffDays === 0 ? "I dag" : `${diffDays} dager siden`,
      labels: labels,
      emoji: group.emoji,
    };
  });
};
