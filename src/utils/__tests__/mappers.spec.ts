import type { CardItem } from "src/components/Card";
import type { Group, User, Membership } from "../../fire-base/models";
import type { GameType, GroupInternal } from "../../types/types";
import type { Document } from "src/fire-base/db";
import {
  mapGameTypesToCardItems,
  mapGroupAndUsersToGroupInternal,
  mapGroupsToCardItems,
} from "../mappers";

describe("mapGroupAndUsersToGroupInternal", () => {
  const group: Document<Group> = {
    id: "g1",
    name: "Gutta",
    emoji: "🎮",
    gameTypes: [
      {
        id: "1",
        emoji: "🎱",
        name: "Biljard",
      },
    ],
    games: [],
    invitationCode: "",
  };

  const userStats: Document<Membership>[] = [
    {
      id: "123-g1",
      userId: "123",
      groupId: "g1",
      wins: 2,
      draws: 1,
      losses: 1,
    },
    {
      id: "911-g1",
      userId: "911",
      groupId: "g1",
      wins: 1,
      draws: 1,
      losses: 2,
    },
  ];

  const users: Document<User>[] = [
    {
      id: "123",
      username: "xXbirgerXx",
      email: "birger@hvl.no",
    },
    {
      id: "911",
      username: "atle",
      email: "atle@hvl.no",
    },
  ];

  const res = mapGroupAndUsersToGroupInternal(group, userStats, users);

  it("Should return correct object", () => {
    expect(res).toEqual({
      id: "g1",
      emoji: "🎮",
      invitationCode: "",
      games: [],
      gameTypes: [
        {
          id: "1",
          emoji: "🎱",
          name: "Biljard",
        },
      ],
      name: "Gutta",
      members: [
        {
          id: "123",
          groupId: "g1",
          wins: 2,
          losses: 1,
          userId: "123",
          draws: 1,
          username: "xXbirgerXx",
          email: "birger@hvl.no",
        },
        {
          id: "911",
          losses: 2,
          userId: "911",
          groupId: "g1",
          draws: 1,
          wins: 1,
          username: "atle",
          email: "atle@hvl.no",
        },
      ],
    });
  });
});

describe("mapGroupsToCardItems", () => {
  const groupInternalBase: GroupInternal = {
    id: "",
    name: "",
    emoji: "",
    games: [],
    invitationCode: "",
    members: [],
  };

  const groups: GroupInternal[] = [
    {
      ...groupInternalBase,
      id: "1",
      name: "Gutane",
      emoji: "OG",
    },
    {
      ...groupInternalBase,
      id: "2",
      name: "Atle & Co",
      emoji: "69",
    },
  ];

  it("Should return correct objects", () => {
    const res = mapGroupsToCardItems(groups);

    expect(res).toEqual([
      {
        key: groups[0].id,
        title: groups[0].name,
        labels: undefined,
        emoji: groups[0].emoji,
        href: "/group/1",
      },
      {
        key: groups[1].id,
        title: groups[1].name,
        labels: undefined,
        emoji: groups[1].emoji,
        href: "/group/2",
      },
    ]);
  });

  it("Should return empty list", () => {
    const res = mapGroupsToCardItems([]);
    expect(res).toEqual([]);
  });
});

describe("mapGameTypesToCardItems", () => {
  const gameTypes: GameType[] = [
    {
      id: "1",
      name: "Tennis",
      emoji: "TS",
    },
    {
      id: "2",
      name: "Tennis",
      emoji: "TE",
    },
    {
      id: "3",
      name: "Fotball",
      emoji: "FB",
    },
  ];

  const expectedNewGameType: CardItem = {
    key: "new",
    title: "+ Legg til",
  };

  it("Should return correct objects", () => {
    const res = mapGameTypesToCardItems(gameTypes);

    expect(res).toEqual([
      expect.objectContaining(expectedNewGameType),
      {
        key: "Fotball3",
        title: gameTypes[2].name,
        emoji: gameTypes[2].emoji,
      },
      {
        key: "Tennis1",
        title: gameTypes[0].name,
        emoji: gameTypes[0].emoji,
      },
      {
        key: "Tennis2",
        title: gameTypes[1].name,
        emoji: gameTypes[1].emoji,
      },
    ]);
  });
});
