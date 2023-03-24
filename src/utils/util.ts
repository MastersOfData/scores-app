import { Timestamp } from "firebase/firestore";
import { Game } from "src/fire-base/models";

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
    const startTime = game.timestamp.toDate().getTime();
    const currentTime = new Date().getTime();
    return Math.abs((currentTime - startTime) / 1000);
  }
  return game.duration || 0;
}