import { Timestamp } from "firebase/firestore";
import type { CardItem } from "src/components/Card";
import type { Document } from "src/fire-base/db";
import { Group, User, Membership, Game } from "../fire-base/models";
import type { GameType, GroupInternal, Member } from "../types/types";
import { convertSecondsToMinutesAndSeconds, differenceBetweenFirestoreTimestampsInDays } from "./util";

export const mapGroupAndUsersToGroupInternal = (
  group: Document<Group>,
  userGroupStats: Document<Membership>[],
  users: Document<User>[]
): GroupInternal => {
  const statsWithUserInfo: Member[] = [];

  userGroupStats.forEach((stats) => {
    const user = users.find((u) => u.id === stats.userId);
    if (user) {
      statsWithUserInfo.push({ ...stats, ...user });
    }
  });

  return {
    ...group,
    members: statsWithUserInfo,
  };
};

export const mapGroupsToCardItems = (
  groups: GroupInternal[],
  includeLabels?: boolean,
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
    ? gameTypes.map((gameType) => ({
      key: gameType.name.concat(gameType.id),
      title: gameType.name,
      emoji: gameType.emoji,
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

export const mapGamesToCardItems = (
  games: Document<Game>[],
  group: GroupInternal
): CardItem[] => {
  if (!games || games.length === 0) return [];

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
