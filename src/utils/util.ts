import { Timestamp } from "firebase/firestore";
import type { Game, GameAction, Membership } from "src/fire-base/models";
import type { Document } from "src/fire-base/db";
import {
  GameActionType,
  LeaderboardStats,
  Member,
} from "../types/types";

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

export const convertSecondsToMinutesAndSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.round(seconds % 60);

  return {
    minutes,
    seconds: secondsRemainder,
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
  const { minutes, seconds } = convertSecondsToMinutesAndSeconds(sec);
  return `${convertNumberToTwoDigitString(
    minutes
  )}:${convertNumberToTwoDigitString(seconds)}`;
};
