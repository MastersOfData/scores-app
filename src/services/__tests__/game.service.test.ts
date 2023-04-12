import { Game } from "src/fire-base/models";
import { createGame, getGamesForGroup, updateGame } from "../game.service";
import * as db from "../../fire-base/db";
import { WithId } from "src/types/types";
import { DocumentReference, Timestamp } from "firebase/firestore";

jest.mock("../../fire-base/db");
const mockGame: WithId<Game> = {
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
  const mockAddDocument = jest.spyOn(db, "addDocument");
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
    it("Should call db", async () => {
      mockGetDocument.mockResolvedValue(mockGame);

      await updateGame("game1", {
        status: "FINISHED"
      });

      expect(mockGetDocument).toBeCalled();
      expect(mockUpdateDocument).toBeCalled();
    })
    it("Should fail when game is not found", async () => {
      expect.assertions(1);
      return updateGame("game1", {
        status: "FINISHED"
      }).catch(e => expect(e).toMatch("Game not found: game1"));
    })
  });

  describe("getGamesForGroup", () => {
    it("Should call db", async () => {
      mockGetDocuments
        .mockResolvedValueOnce([{ id: "1" }])
        .mockResolvedValueOnce([mockGame]);

      await getGamesForGroup("user1", "group1");

      expect(mockGetDocuments).toBeCalledTimes(2);
    });
  });
  // it("should pass", () => {
  //   const mockGetDocuments = jest.spyOn(db, "getDocuments")
  //     .mockResolvedValueOnce([{ id: "1" }])
  //     .mockResolvedValueOnce([mockGame]);

  //   const res = getGamesForGroup("asd", "asd");

  //   expect(mockGetDocuments).toHaveBeenCalledTimes(2);
  // });
})