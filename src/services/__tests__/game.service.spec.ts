/* eslint-disable @typescript-eslint/no-explicit-any */
import { Game } from "src/fire-base/models";
import { createGame, getGamesForGroup, updateGame } from "../game.service";
import * as db from "../../fire-base/db";
import { WithId } from "src/types/types";
import { Timestamp } from "firebase/firestore";

jest.mock("../../fire-base/db");

const mockGame: WithId<Game> = {
  id: "1",
  gameTypeId: "",
  groupId: "",
  adminId: "",
  players: [],
  timestamp: new Timestamp(1, 1),
  status: "FINISHED",
};

describe("GameService", () => {
  const mockGetDocument = jest.spyOn(db, "getDocument");
  const mockGetDocuments = jest.spyOn(db, "getDocuments");
  const mockAddDocument = jest.spyOn(db, "addDocument");
  const mockUpdateDocument = jest.spyOn(db, "updateDocument");

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createGame", () => {
    it("Should call database", async () => {
      mockAddDocument.mockResolvedValueOnce({ id: "1" } as unknown as any);
      mockGetDocument.mockResolvedValueOnce(mockGame);

      await createGame("user1", {
        groupId: "group1",
        gameTypeId: "1",
        allowTeams: false,
        participants: [],
      });

      expect(mockAddDocument).toBeCalledTimes(1);
      expect(mockGetDocument).toBeCalledTimes(1);
    });

    it("Should reject when game is not created", async () => {
      mockAddDocument.mockResolvedValueOnce({ id: "1" } as unknown as any);

      expect.assertions(1);
      await expect(
        createGame("user1", {
          groupId: "group1",
          gameTypeId: "1",
          allowTeams: false,
          participants: [],
        })
      ).rejects.toEqual(undefined);
    });
  });

  describe("updateGame", () => {
    it("Should call database", async () => {
      mockGetDocument.mockResolvedValue(mockGame);

      await updateGame("game1", {
        status: "FINISHED",
        winner: undefined,
      });

      expect(mockGetDocument).toBeCalled();
      expect(mockUpdateDocument).toBeCalled();
    });

    it("Should reject when game is not found", async () => {
      expect.assertions(1);
      await expect(
        updateGame("game1", {
          status: "FINISHED",
          winner: undefined,
        })
      ).rejects.toMatch("Game not found: game1");
    });
  });

  describe("getGamesForGroup", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1" }])
        .mockResolvedValueOnce([mockGame]);

      await getGamesForGroup("user1", "group1");

      expect(mockGetDocuments).toBeCalledTimes(2);
    });

    it("Should return correctly", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1" }])
        .mockResolvedValueOnce([mockGame]);

      const result = await getGamesForGroup("user1", "group1");

      expect(result).toEqual([mockGame]);
    });

    it("Should reject when user is not a member of the group", async () => {
      mockGetDocuments.mockResolvedValueOnce([]);

      expect.assertions(1);
      await expect(getGamesForGroup("user1", "group1")).rejects.toMatch(
        "User is not a member of the group: group1"
      );
    });
  });
});
