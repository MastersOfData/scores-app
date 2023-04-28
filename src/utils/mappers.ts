import { Timestamp } from "firebase/firestore";
import type { CardItem } from "src/components/Card";
import type { Document } from "src/fire-base/db";
import { Group, User, Membership, Game } from "../fire-base/models";
import type { GameType, GroupInternal, Member } from "../types/types";
import {
  calculateGroupLeaderboard,
  differenceBetweenFirestoreTimestampsInDays,
} from "./util";

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
  includeLabels?: boolean
): CardItem[] => {
  return groups.map((group) => {
    console.log(group.members);
    const groupLeaderboard = calculateGroupLeaderboard(group.members);
    const groupMembersSortedByPoints = groupLeaderboard.sort(
      (a, b) => b.winRatio - a.winRatio
    );
    return {
      key: group.id,
      title: group.name,
      labels: includeLabels
        ? [
            `${group.members.length} medlemmer`,
            `${groupMembersSortedByPoints[0].username} leder 🏆`,
          ]
        : undefined,
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
    labels: [game.gameTypeId, `${game.winner} vant! 🎉`],
    emoji: game.gameTypeId,
  };
};
