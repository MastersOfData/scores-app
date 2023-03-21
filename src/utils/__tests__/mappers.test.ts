import { Group, User, UserGroupStatistic } from "../../fire-base/models";
import { WithId } from "../../types/types";
import { mapGroupAndUsersToGroupInternal } from "../mappers";

describe("mapGroupAndUsersToGroupInternal", () => {
  const group: WithId<Group> = {
    id: "g1",
    name: "Gutta",
    emoji: "🎮",
    gameTypes: [
      {
        emoji: "🎱",
        name: "Biljard",
      },
    ],
    games: [],
    invitationCode: "",
  };

  const userStats: WithId<UserGroupStatistic>[] = [
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

  const users: WithId<User>[] = [
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
