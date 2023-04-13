import { Group, Membership, User } from "src/fire-base/models";
import { GameType, GroupInternal, WithId } from "src/types/types";
import * as db from "../../fire-base/db";
import { createGameTypeForGroup, getGroupInternal, getGroupsForCurrentUser, getStatsForAllUsersInGroup, joinGroupByInvitationCode, removeUserFromGroup } from "../group.service";

jest.mock("../../fire-base/db");

const userMockBase: User = {
  email: "",
  username: "",
}

const groupMockBase: Group = {
  name: "",
  emoji: "",
  games: [],
  invitationCode: "123456",
};

const membershipMockBase: Membership = {
  userId: "user1",
  groupId: "group1",
  wins: 0,
  draws: 0,
  losses: 0,
}

const userMocks: WithId<User>[] = [
  {
    id: "user1",
    ...userMockBase,
  },
  {
    id: "user2",
    ...userMockBase,
  },
  {
    id: "user3",
    ...userMockBase,
  },
  {
    id: "user4",
    ...userMockBase,
  }
];

const groupMocks: WithId<Group>[] = [
  {
    id: "group1",
    ...groupMockBase,
  },
  {
    id: "group2",
    ...groupMockBase,
  }
  , {
    id: "group3",
    ...groupMockBase,
  }
];

const membershipMocks: WithId<Membership>[] = [
  {
    ...membershipMockBase,
    id: "1",
    userId: userMocks[0].id,
    groupId: groupMocks[0].id,
  },
  {
    ...membershipMockBase,
    id: "2",
    userId: userMocks[1].id,
    groupId: groupMocks[0].id,
  },
  {
    ...membershipMockBase,
    id: "3",
    userId: userMocks[1].id,
    groupId: groupMocks[1].id,
  },
  {
    ...membershipMockBase,
    id: "4",
    userId: userMocks[2].id,
    groupId: groupMocks[1].id,
  },
  {
    ...membershipMockBase,
    id: "5",
    userId: userMocks[2].id,
    groupId: groupMocks[2].id,
  },
  {
    ...membershipMockBase,
    id: "6",
    userId: userMocks[3].id,
    groupId: groupMocks[2].id,
  }
];


describe("GroupService", () => {
  const mockGetDocument = jest.spyOn(db, "getDocument");
  const mockGetDocuments = jest.spyOn(db, "getDocuments");
  // const mockAddDocument = jest.spyOn(db, "addDocument");
  const mockUpdateDocument = jest.spyOn(db, "updateDocument");
  const mockSetDocument = jest.spyOn(db, "setDocument");
  const mockDeleteDocument = jest.spyOn(db, "deleteDocument");

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getGroupsForCurrentUser", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1", ...membershipMockBase }])
        .mockResolvedValueOnce(groupMocks);

      await getGroupsForCurrentUser("user1");

      expect(mockGetDocuments).toBeCalledTimes(2);
    });

    it("Should return empty list when no groups are found", async () => {
      mockGetDocuments.mockResolvedValueOnce([]);

      const res = await getGroupsForCurrentUser("user");

      expect(mockGetDocuments).toBeCalledTimes(1);
      expect(res).toStrictEqual([]);
    });
  });

  // TODO: Mock DocumentReference
  // describe("createGroup", () => {
  //   it("Should call database", async () => {
  //     mockGetDocuments
  //       .mockResolvedValueOnce([{ id: "1" }])
  //       .mockResolvedValueOnce([]);

  //     await createGroup("user1", "420", "69");

  //     expect(mockGetDocuments).toBeCalledTimes(2);
  //   });
  // });

  describe("joinGroupByInvitationCode", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "group1", ...groupMockBase }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(membershipMocks)
        .mockResolvedValueOnce(userMocks);

      mockGetDocument.mockResolvedValueOnce({ id: "group1", ...groupMockBase });

      await joinGroupByInvitationCode("123456", "user1");

      expect(mockGetDocuments).toBeCalledTimes(4);
      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockSetDocument).toBeCalledTimes(1);
    });

    it("Should reject when user is already member", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "group1", ...groupMockBase }])
        .mockResolvedValueOnce([{ id: "group1" }]);

      expect.assertions(1);
      return joinGroupByInvitationCode("123456", "user1")
        .catch(e => expect(e).toMatch("Du er allerede medlem i gruppen"))
    });

    it("Should reject when group doesn't exist", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([])

      expect.assertions(1);
      return joinGroupByInvitationCode("123456", "user1")
        .catch(e => expect(e).toMatch("Gruppe med kode 123456 finnes ikke."));
    });

    it("Should set document with correct information", async () => {
      const mockUserGroupStatistic: Membership = {
        userId: "user1",
        groupId: "group1",
        wins: 0,
        draws: 0,
        losses: 0,
      };

      mockGetDocuments
        .mockResolvedValueOnce([{ id: "group1", ...groupMockBase }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(membershipMocks)
        .mockResolvedValueOnce(userMocks);

      mockGetDocument.mockResolvedValueOnce({ id: "group1", ...groupMockBase });

      await joinGroupByInvitationCode("123456", "user1");

      expect(mockSetDocument).toBeCalledWith(db.membershipsCol, "user1-group1", mockUserGroupStatistic);
    });
  });

  describe("removeUserFromGroup", () => {
    it("Should call database", async () => {
      await removeUserFromGroup("user1", "group1");
      expect(mockDeleteDocument).toBeCalledTimes(1);
    });
  });

  describe("getStatsForAllUsersInGroup", () => {
    it("Should call database", async () => {
      mockGetDocuments.mockResolvedValueOnce(membershipMocks);
      await getStatsForAllUsersInGroup("group1");
      expect(mockGetDocuments).toBeCalledTimes(1);
    });
  });

  describe("getGroupInternal", () => {
    it("Should call database", async () => {
      mockGetDocument
        .mockResolvedValue(groupMocks[0]);
      mockGetDocuments
        .mockResolvedValueOnce(membershipMocks)
        .mockResolvedValueOnce(userMocks);

      await getGroupInternal(groupMocks[0].id);

      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockGetDocuments).toBeCalledTimes(2);
    });

    it("Should return correctly", async () => {
      const expected: GroupInternal = {
        ...groupMocks[0],
        members: [
          {
            ...membershipMocks[0],
            ...userMocks[0],
          },
          {
            ...membershipMocks[1],
            ...userMocks[1],
          },
        ],
      }
      mockGetDocument
        .mockResolvedValue(groupMocks[0]);
      mockGetDocuments
        .mockResolvedValueOnce([membershipMocks[0], membershipMocks[1]])
        .mockResolvedValueOnce([userMocks[0], userMocks[1]]);

      const result = await getGroupInternal(groupMocks[0].id);

      expect(result).toEqual(expected);
    });
  });

  // TODO
  // describe("getGroupsInternalForCurrentUser", () => {
  //   it("Should call database", async () => {
  //     mockGetDocuments
  //       .mockResolvedValueOnce([membershipMocks[0], membershipMocks[1], membershipMocks[2], membershipMocks[3]])
  //       .mockResolvedValueOnce(userMocks);

  //     await getGroupsInternalForCurrentUser("user1");

  //     expect(mockGetDocuments).toBeCalledTimes(3);
  //   });
  // });

  // TODO
  describe("createGameTypeForGroup", () => {
    it("Should call database", async () => {
      mockGetDocument.mockResolvedValueOnce(groupMocks[0]);

      await createGameTypeForGroup("1", "name", "emoji");

      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockUpdateDocument).toBeCalledTimes(1);
    });

    it("Should return correctly", async () => {
      const expected: GameType = {
        id: "1",
        name: "name",
        emoji: "emoji",
      }
      mockGetDocument.mockResolvedValueOnce(groupMocks[0]);

      const result = await createGameTypeForGroup(groupMocks[0].id, "name", "emoji");

      expect(result).toEqual(expected);
    });

    it("Calls updateDocument with correct values", async () => {
      const expectedUpdatedGroup = {
        ...groupMocks[0],
        gameTypes: [{
          id: "1",
          name: "name",
          emoji: "emoji",
        }]
      }
      mockGetDocument.mockResolvedValueOnce(groupMocks[0]);

      await createGameTypeForGroup(groupMocks[0].id, "name", "emoji");

      expect(mockUpdateDocument).toBeCalledWith(db.groupsCol, groupMocks[0].id, expectedUpdatedGroup);
    });

    // it("Should reject when no group exists", () => {
    //   mockGetDocument.mockResolvedValueOnce(null);

    //   expect(createGameTypeForGroup("group1", "X-Men", "x")).rejects
    //     .toThrowError();
    // });
  });
});
