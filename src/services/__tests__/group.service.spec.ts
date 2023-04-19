/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Group, Membership, User } from "src/fire-base/models";
import type { GameType, GroupInternal } from "src/types/types";
import * as db from "../../fire-base/db";
import {
  createGameTypeForGroup,
  createGroup,
  getGroupsForCurrentUser,
  getGroupInternal,
  getStatsForAllUsersInGroup,
  joinGroupByInvitationCode,
  removeUserFromGroup,
} from "../group.service";

jest.mock("../../fire-base/db");

const baseMockUser: User = {
  email: "",
  username: "",
};

const baseMockGroup: Group = {
  name: "",
  emoji: "",
  games: [],
  invitationCode: "123456",
};

const baseMockMembership: Membership = {
  userId: "user1",
  groupId: "group1",
  wins: 0,
  draws: 0,
  losses: 0,
};

const mockUsers: db.Document<User>[] = [
  {
    id: "user1",
    ...baseMockUser,
  },
  {
    id: "user2",
    ...baseMockUser,
  },
  {
    id: "user3",
    ...baseMockUser,
  },
  {
    id: "user4",
    ...baseMockUser,
  },
];

const mockGroups: db.Document<Group>[] = [
  {
    id: "group1",
    ...baseMockGroup,
  },
  {
    id: "group2",
    ...baseMockGroup,
  },
  {
    id: "group3",
    ...baseMockGroup,
  },
];

const mockMemberships: db.Document<Membership>[] = [
  {
    ...baseMockMembership,
    id: "1",
    userId: mockUsers[0].id,
    groupId: mockGroups[0].id,
  },
  {
    ...baseMockMembership,
    id: "2",
    userId: mockUsers[1].id,
    groupId: mockGroups[0].id,
  },
  {
    ...baseMockMembership,
    id: "3",
    userId: mockUsers[1].id,
    groupId: mockGroups[1].id,
  },
  {
    ...baseMockMembership,
    id: "4",
    userId: mockUsers[2].id,
    groupId: mockGroups[1].id,
  },
  {
    ...baseMockMembership,
    id: "5",
    userId: mockUsers[2].id,
    groupId: mockGroups[2].id,
  },
  {
    ...baseMockMembership,
    id: "6",
    userId: mockUsers[3].id,
    groupId: mockGroups[2].id,
  },
];

describe("GroupService", () => {
  const mockGetDocument = jest.spyOn(db, "getDocument");
  const mockGetDocuments = jest.spyOn(db, "getDocuments");
  const mockAddDocument = jest.spyOn(db, "addDocument");
  const mockUpdateDocument = jest.spyOn(db, "updateDocument");
  const mockSetDocument = jest.spyOn(db, "setDocument");
  const mockDeleteDocument = jest.spyOn(db, "deleteDocument");

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getGroupsForCurrentUser", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1", ...baseMockMembership }])
        .mockResolvedValueOnce(mockGroups);

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

  describe("createGroup", () => {
    it("Should call database", async () => {
      mockAddDocument.mockResolvedValueOnce({ id: "1" } as unknown as any); // groupRef
      mockGetDocument
        .mockResolvedValueOnce(mockGroups[0]) // joinGroup
        .mockResolvedValue(mockGroups[0]); // getGroupInternal
      mockGetDocuments
        .mockResolvedValueOnce([]) // createPincode
        .mockResolvedValueOnce(mockMemberships) // getGroupInternal
        .mockResolvedValueOnce(mockUsers); // getGroupInternal

      await createGroup("user1", "420", "69");

      expect(mockAddDocument).toBeCalledTimes(1);
      expect(mockSetDocument).toBeCalledTimes(1);
      expect(mockGetDocument).toBeCalledTimes(2);
      expect(mockGetDocuments).toBeCalledTimes(3);
    });

    it("Should return correct object", async () => {
      mockAddDocument.mockResolvedValueOnce({ id: "1" } as unknown as any); // groupRef
      mockGetDocument
        .mockResolvedValueOnce({ ...mockGroups[0], name: "Gutta", emoji: "OG" }) // getGroupInternal
        .mockResolvedValueOnce({
          ...mockGroups[0],
          name: "Gutta",
          emoji: "OG",
        }); // getGroupInternal
      mockGetDocuments
        .mockResolvedValueOnce([]) // createPincode
        .mockResolvedValueOnce([mockMemberships[0]]) // getGroupInternal
        .mockResolvedValueOnce([
          { ...mockUsers[0], username: "Birger", email: "birger@hvl.no" },
        ]); // getGroupInternal

      const res = await createGroup("group1", "Gutta", "OG");

      expect(res).toEqual({
        id: "group1",
        name: "Gutta",
        emoji: "OG",
        games: [],
        invitationCode: "123456",
        gameTypes: undefined,
        members: [
          {
            id: "user1",
            username: "Birger",
            email: "birger@hvl.no",
            wins: 0,
            draws: 0,
            losses: 0,
            groupId: "group1",
            userId: "user1",
          },
        ],
      });
    });
  });

  describe("joinGroupByInvitationCode", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "group1", ...baseMockGroup }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockMemberships)
        .mockResolvedValueOnce(mockUsers);

      mockGetDocument.mockResolvedValueOnce({ id: "group1", ...baseMockGroup });

      await joinGroupByInvitationCode("123456", "user1");

      expect(mockGetDocuments).toBeCalledTimes(4);
      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockSetDocument).toBeCalledTimes(1);
    });

    it("Should reject when user is already member", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "group1", ...baseMockGroup }])
        .mockResolvedValueOnce([{ id: "group1" }]);

      expect.assertions(1);
      await expect(
        joinGroupByInvitationCode("123456", "user1")
      ).rejects.toMatch("Du er allerede medlem i gruppen");
    });

    it("Should reject when group doesn't exist", async () => {
      mockGetDocuments.mockResolvedValueOnce([]);

      expect.assertions(1);
      await expect(
        joinGroupByInvitationCode("123456", "user1")
      ).rejects.toMatch("Gruppe med kode 123456 finnes ikke.");
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
        .mockResolvedValueOnce([{ id: "group1", ...baseMockGroup }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockMemberships)
        .mockResolvedValueOnce(mockUsers);

      mockGetDocument.mockResolvedValueOnce({ id: "group1", ...baseMockGroup });

      await joinGroupByInvitationCode("123456", "user1");

      expect(mockSetDocument).toBeCalledWith(
        db.collections.memberships,
        "user1-group1",
        mockUserGroupStatistic
      );
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
      mockGetDocuments.mockResolvedValueOnce(mockMemberships);
      await getStatsForAllUsersInGroup("group1");
      expect(mockGetDocuments).toBeCalledTimes(1);
    });
  });

  describe("getGroupInternal", () => {
    it("Should call database", async () => {
      mockGetDocument.mockResolvedValue(mockGroups[0]);
      mockGetDocuments
        .mockResolvedValueOnce(mockMemberships)
        .mockResolvedValueOnce(mockUsers);

      await getGroupInternal(mockGroups[0].id);

      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockGetDocuments).toBeCalledTimes(2);
    });

    it("Should return correctly", async () => {
      const expected: GroupInternal = {
        ...mockGroups[0],
        members: [
          {
            ...mockMemberships[0],
            ...mockUsers[0],
          },
          {
            ...mockMemberships[1],
            ...mockUsers[1],
          },
        ],
      };
      mockGetDocument.mockResolvedValue(mockGroups[0]);
      mockGetDocuments
        .mockResolvedValueOnce([mockMemberships[0], mockMemberships[1]])
        .mockResolvedValueOnce([mockUsers[0], mockUsers[1]]);

      const result = await getGroupInternal(mockGroups[0].id);

      expect(result).toEqual(expected);
    });
  });

  // Need to find out if function is testable. Current test implementation will not wait for nested promises
  // to resolve or reject leading to data being 'undefined'.
  // describe("getGroupsInternalForCurrentUser", () => {
  //   it("Should call database", async () => {
  //     mockGetDocuments
  //       .mockResolvedValueOnce([mockMemberships[0], mockMemberships[1]])
  //       .mockResolvedValueOnce([
  //         mockMemberships[0],
  //         mockMemberships[1],
  //         mockMemberships[2],
  //         mockMemberships[3],
  //       ])
  //       .mockResolvedValueOnce([mockUsers[0], mockUsers[1]]);

  //     await getGroupsInternalForCurrentUser("user1");

  //     expect(mockGetDocuments).toBeCalledTimes(3);
  //   });
  // });

  describe("createGameTypeForGroup", () => {
    it("Should call database", async () => {
      mockGetDocument.mockResolvedValueOnce(mockGroups[0]);

      await createGameTypeForGroup("1", "name", "emoji");

      expect(mockGetDocument).toBeCalledTimes(1);
      expect(mockUpdateDocument).toBeCalledTimes(1);
    });

    it("Should return correctly", async () => {
      const expected: GameType = {
        id: "1",
        name: "name",
        emoji: "emoji",
      };
      mockGetDocument.mockResolvedValueOnce(mockGroups[0]);

      const result = await createGameTypeForGroup(
        mockGroups[0].id,
        "name",
        "emoji"
      );

      expect(result).toEqual(expected);
    });

    it("Should call updateDocument with correct values", async () => {
      const expectedUpdatedGroup = {
        ...mockGroups[0],
        gameTypes: [
          {
            id: "1",
            name: "name",
            emoji: "emoji",
          },
        ],
      };
      mockGetDocument.mockResolvedValueOnce(mockGroups[0]);

      await createGameTypeForGroup(mockGroups[0].id, "name", "emoji");

      expect(mockUpdateDocument).toBeCalledWith(
        db.collections.groups,
        mockGroups[0].id,
        expectedUpdatedGroup
      );
    });

    it("Should reject when no group exists", async () => {
      mockGetDocument.mockResolvedValueOnce(null);

      expect.assertions(1);
      await expect(
        createGameTypeForGroup("group1", "X-Men", "x")
      ).rejects.toEqual(undefined);
    });
  });
});
