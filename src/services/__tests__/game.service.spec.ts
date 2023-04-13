import { Game } from "src/fire-base/models";
import { getGamesForGroup, updateGame } from "../game.service";
import * as db from "../../fire-base/db";
import { WithId } from "src/types/types";
import { Timestamp } from "firebase/firestore";

jest.mock("../../fire-base/db");

const gameMock: WithId<Game> = {
  id: "1",
  gameTypeId: "",
  groupId: "",
  adminId: "",
  players: [],
  timestamp: new Timestamp(1, 1),
  status: "FINISHED",
}

describe("GameService", () => {
  const mockGetDocument = jest.spyOn(db, "getDocument");
  const mockGetDocuments = jest.spyOn(db, "getDocuments");
  // const mockAddDocument = jest.spyOn(db, "addDocument");
  const mockUpdateDocument = jest.spyOn(db, "updateDocument");

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO: Find a way to mock DocumentReference and CollectionReference
  // describe("createGame", () => {
  //   it("Should call addDocument", async () => {
  //     await createGame("user1", {
  //       groupId: "group1",
  //       gameTypeId: "1",
  //       allowTeams: false,
  //       participants: []
  //     });
  //     expect(mockAddDocument).toBeCalled();
  //     expect(mockGetDocument).toBeCalled();
  //   });
  // });

  describe("updateGame", () => {
    it("Should call database", async () => {
      mockGetDocument.mockResolvedValue(gameMock);

      await updateGame("game1", {
        status: "FINISHED"
      });

      expect(mockGetDocument).toBeCalled();
      expect(mockUpdateDocument).toBeCalled();
    });

    it("Should reject when game is not found", async () => {
      expect.assertions(1);
      return updateGame("game1", {
        status: "FINISHED"
      }).catch(e => expect(e).toMatch("Game not found: game1"));
    });
  });

  describe("getGamesForGroup", () => {
    it("Should call database", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1" }])
        .mockResolvedValueOnce([gameMock]);

      await getGamesForGroup("user1", "group1");

      expect(mockGetDocuments).toBeCalledTimes(2);
    });

    it("Should return correctly", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1" }])
        .mockResolvedValueOnce([gameMock]);

      const result = await getGamesForGroup("user1", "group1");

      expect(result).toEqual([gameMock]);
    });

    it("Should reject when user is not a member of the group", () => {
      mockGetDocuments.mockResolvedValueOnce([]);

      expect.assertions(1);
      return getGamesForGroup("user1", "group1")
        .catch(e => expect(e).toMatch("User is not a member of the group: group1"));
    });
  });
})