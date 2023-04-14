import { Timestamp } from "firebase/firestore";
import { Game, Membership } from "src/fire-base/models";
import { CardItem } from "src/components/Card";
import {
  GameType,
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
  // Fix bug: Sett date-klokkeslett til 00:00:00
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
};

export const convertSecondsToMinutesAndSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.round(seconds % 60);

  return {
    minutes,
    seconds: secondsRemainder,
  };
};

export const mapGroupsToCardItems = (
  groups: GroupInternal[],
  includeLabels: boolean
): CardItem[] => {
  return groups.map((group) => {
    return {
      key: group.id,
      title: group.name,
      labels: includeLabels ? ["Noe relevant info", "Annen info"] : undefined,
      emoji: group.emoji,
      href: `/group/${group.id}`,
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

export const mapGameToCardItem = (game: WithId<Game>) => {
  const endDate = game.duration
    ? Timestamp.fromMillis(game.duration)
    : Timestamp.fromDate(new Date());

  return {
    key: game.id,
    title: `${differenceBetweenFirestoreTimestampsInDays(
      endDate,
      Timestamp.fromDate(new Date())
    )} dager siden`,
    labels: [game.gameTypeId, `${game.winners} vant! 🎉`],
    emoji: game.gameTypeId,
  };
};

export const generatePincode = () => {
  const digits = "0123456789";
  let pin = "";
  for (let i = 0; i < 6; i++) {
    pin += digits[Math.floor(Math.random() * 10)];
  }
  return pin;
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

  return games
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
    .map((game) => {
      const diffDays = differenceBetweenFirestoreTimestampsInDays(
        game.timestamp,
        Timestamp.fromDate(new Date())
      );

      const labels: string[] = [];

      const gameType = group.gameTypes?.find((gt) => gt.id === game.gameTypeId);
      if (gameType) {
        labels.push(`${gameType.name}`);
      }

      if (game.status === "ONGOING" && game.duration) {
        const { minutes, seconds } = convertSecondsToMinutesAndSeconds(
          game.duration
        );
        labels.push(`Varighet: ${minutes}:${seconds}`);
      }

      if (game.status === "PAUSED") {
        labels.push("Ikke fullført");
      }

      if (game.status === "FINISHED") {
        if (game.winners && game.winners.length === 1) {
          const gameWinners = game.winners;
          const winner = group.members.find((u) => u.userId === gameWinners[0]);
          if (winner) labels.push(`${winner.username} vant! 🎉`);
        } else if (game.winners && game.winners.length > 1) {
          labels.push("Uavgjort");
        } else labels.push("Fullført");
      }

      return {
        key: game.id,
        title: diffDays === 0 ? "I dag" : `${diffDays} dager siden`,
        labels: labels,
        emoji: gameType?.emoji,
      };
    });
};

export const recalculateMembershipsResults = (
  memberships: WithId<Membership>[],
  participants: string[],
  winners: string[]
): WithId<Membership>[] => {
  const multipleWinners = winners.length > 1;
  const updatedMemberships: WithId<Membership>[] = [];

  participants.forEach((participant) => {
    const membership = memberships.find(
      (membership) => membership.userId === participant
    );
    if (!membership) return;
    const isWinner = winners.includes(participant);

    if (isWinner)
      updatedMemberships.push({
        ...membership,
        wins: !multipleWinners ? membership.wins + 1 : membership.wins,
        draws: multipleWinners ? membership.draws + 1 : membership.draws,
      });
    else
      updatedMemberships.push({
        ...membership,
        losses: membership.losses + 1,
      });
  });

  return updatedMemberships;
};
