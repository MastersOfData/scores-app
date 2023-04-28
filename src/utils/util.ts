import { Timestamp } from "firebase/firestore";
import type { Game, GameAction, Membership } from "src/fire-base/models";
import type { Document } from "src/fire-base/db";
import type { CardItem } from "src/components/Card";
import {
  GameActionType,
  GameType,
  GroupInternal,
  LeaderboardStats,
  Member,
  PlayerScore,
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
  const t1date = t1.toDate();
  const d1 = new Date(
    t1date.getFullYear(),
    t1date.getMonth(),
    t1date.getDate()
  );

  const t2date = t2.toDate();
  const d2 = new Date(
    t2date.getFullYear(),
    t2date.getMonth(),
    t2date.getDate()
  );

  const secondsDiff = d2.getTime() / 1000 - d1.getTime() / 1000;
  const daysDiff = secondsDiff / (24 * 60 * 60);

  return Math.floor(daysDiff);
};

export const differenceBetweenFirestoreTimestampsInSeconds = (
  t1: Timestamp,
  t2: Timestamp
): number => {
  const d1 = t1.toDate();
  const d2 = t2.toDate();

  const secondsDiff = d2.getTime() / 1000 - d1.getTime() / 1000;
  return Math.floor(secondsDiff);
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

export const convertSecondsToHoursMinutesAndSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemainder = Math.round(seconds % 60);

  return {
    hours,
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

export const mapGameToCardItem = (game: Document<Game>) => {
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
  games: Document<Game>[],
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
        labels.push(`Pågår`);
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

      if (game.status === "NOT_STARTED") {
        labels.push("Ikke startet");
      }

      return {
        key: game.id,
        title: diffDays === 0 ? "I dag" : `${diffDays} dager siden`,
        labels: labels,
        emoji: gameType?.emoji,
        href:
          game.status === "FINISHED"
            ? `/game/${game.id}/result`
            : `/game/${game.id}`,
      };
    });
};

export const recalculateMembershipsResults = (
  memberships: Document<Membership>[],
  participants: string[],
  winners: string[]
): Document<Membership>[] => {
  const multipleWinners = winners.length > 1;
  const updatedMemberships: Document<Membership>[] = [];

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

// Returns time elapsed in seconds
export const calculateElapsedGameTime = (gameLog: GameAction[]) => {
  const start = gameLog.find(
    (logItem) => logItem.actionType === GameActionType.START
  );
  const finish = gameLog.find(
    (logItem) => logItem.actionType === GameActionType.FINISH
  );

  if (!start) return 0;

  if (!finish) {
    return differenceBetweenFirestoreTimestampsInSeconds(
      start.timestamp,
      Timestamp.now()
    );
  }

  return differenceBetweenFirestoreTimestampsInSeconds(
    start.timestamp,
    finish.timestamp
  );
};

export const convertNumberToTwoDigitString = (n: number) =>
  n >= 10 ? n.toString() : `0${n}`;

export const getElapsedTimeStringFromSeconds = (sec: number) => {
  const { hours, minutes, seconds } =
    convertSecondsToHoursMinutesAndSeconds(sec);
  if (hours === 0) {
    return `${convertNumberToTwoDigitString(
      minutes
    )}:${convertNumberToTwoDigitString(seconds)}`;
  } else {
    return `${convertNumberToTwoDigitString(
      hours
    )}:${convertNumberToTwoDigitString(
      minutes
    )}:${convertNumberToTwoDigitString(seconds)}`;
  }
};

export const calculateLiveScores = (gameLog: GameAction[]): PlayerScore[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const init: any = {};

  const scoresObj = gameLog.reduce((scores, logItem) => {
    if (logItem.actionType === GameActionType.ADD_POINTS && logItem.subjectId) {
      scores[logItem.subjectId] = scores[logItem.subjectId] || 0;
      scores[logItem.subjectId] = scores[logItem.subjectId] + logItem.value;
    }
    return scores;
  }, init);

  const scores = Object.entries(scoresObj).map(
    (score) =>
      ({ playerId: score[0], points: score[1] as number } as PlayerScore)
  );

  return scores;
};

export const removeCorruptGameActions = (
  game: Game,
  gameLog: Document<GameAction>[]
) => {
  const playerOrder = game.players.map((player) => player.playerId);
  let nextPlayersTurn = 0;

  const sortedGameLog = gameLog.sort(
    (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
  );

  const startAction = sortedGameLog.shift();
  if (!startAction)
    return {
      updatedGameLog: sortedGameLog,
      nextPlayersTurn: playerOrder[nextPlayersTurn],
    };

  const updatedGameLog: Document<GameAction>[] = [startAction];

  while (sortedGameLog.length > 0) {
    const nextAction = sortedGameLog.shift();
    if (
      nextAction &&
      nextAction.subjectId &&
      nextAction.subjectId === playerOrder[nextPlayersTurn]
    ) {
      updatedGameLog.push(nextAction);
      nextPlayersTurn = (nextPlayersTurn + 1) % playerOrder.length;
    } else if (nextAction && nextAction.actionType === GameActionType.FINISH) {
      updatedGameLog.push(nextAction);
    }
  }

  return { updatedGameLog, nextPlayersTurn: playerOrder[nextPlayersTurn] };
};

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
