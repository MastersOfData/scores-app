import {
  calculateDuration,
  calculateLiveScores,
  convertSecondsToHoursMinutesAndSeconds,
  differenceBetweenFirestoreTimestampsInDays,
  generateMembershipDocumentId,
  removeCorruptGameActions,
} from "../util";
import { Timestamp } from "firebase/firestore";
import { Game, GameAction } from "src/fire-base/models";
import { GameActionType } from "../../types/types";
import { Document } from "../../fire-base/db";

describe("generateMembershipDocumentId", () => {
  it.each([
    ["asd", "123", "asd-123"],
    ["a", "b", "a-b"],
    ["asd", "", "asd-"],
  ])("Should return correct value", (userId, groupId, expected) => {
    const result = generateMembershipDocumentId(userId, groupId);
    expect(result).toBe(expected);
  });

  it.each([
    ["asd", "123"],
    ["a", "b"],
    ["asd", ""],
  ])("Should return correct type", (userId, groupId) => {
    const result = generateMembershipDocumentId(userId, groupId);
    expect(typeof result).toBe("string");
  });
});

describe("differenceBetweenFirestoreTimestampsInDays", () => {
  it("calculates the correct difference in days within the same month", () => {
    expect(
      differenceBetweenFirestoreTimestampsInDays(
        Timestamp.fromDate(new Date(2022, 5, 14)),
        Timestamp.fromDate(new Date(2022, 5, 29))
      )
    ).toBe(15);
  });
  it("calculates the correct difference in days in different months", () => {
    expect(
      differenceBetweenFirestoreTimestampsInDays(
        Timestamp.fromDate(new Date(2022, 2, 29)),
        Timestamp.fromDate(new Date(2022, 4, 5))
      )
    ).toBe(37);
  });
  it("calculates the correct difference in days in different years", () => {
    expect(
      differenceBetweenFirestoreTimestampsInDays(
        Timestamp.fromDate(new Date(2021, 2, 29)),
        Timestamp.fromDate(new Date(2022, 4, 5))
      )
    ).toBe(37 + 365);
  });
  it("calculates the correct difference in days in different years", () => {
    expect(
      differenceBetweenFirestoreTimestampsInDays(
        Timestamp.fromDate(new Date(2023, 2, 1, 13)),
        Timestamp.fromDate(new Date(2023, 2, 5))
      )
    ).toBe(4);
  });
  it("calculates the correct difference in days in different years", () => {
    expect(
      differenceBetweenFirestoreTimestampsInDays(
        Timestamp.fromDate(new Date(2023, 2, 1, 13)),
        Timestamp.fromDate(new Date(2023, 2, 5, 14))
      )
    ).toBe(4);
  });
});

describe("calculatDuration", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 3, 24));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockGame1: Game = {
    adminId: "",
    gameTypeId: "",
    groupId: "",
    players: [
      {
        playerId: "player69",
        points: 420,
      },
    ],
    winners: [],
    timestamp: Timestamp.fromDate(new Date(2023, 2, 21)),
    status: "ONGOING",
  };

  const mockGame2: Game = {
    ...mockGame1,
    status: "FINISHED",
  };

  const mockGame3: Game = {
    ...mockGame1,
    status: "PAUSED",
  };

  it.each([
    // TODO: Add tests for new dates and fix calculateDuration
    [
      {
        ...mockGame2,
      },
      0,
    ],
    [
      {
        ...mockGame2,
        duration: 69,
      },
      69,
    ],
    [
      {
        ...mockGame3,
        duration: 42069,
      },
      42069,
    ],
  ])("calculates the correct duration", (game, expected) => {
    expect(calculateDuration(game)).toBe(expected);
  });
});

describe("Convert seconds to minutes and seconds", () => {
  const testCases = [
    {
      input: 360,
      return: { hours: 0, minutes: 6, seconds: 0 },
    },
    {
      input: 50,
      return: { hours: 0, minutes: 0, seconds: 50 },
    },
    {
      input: 130,
      return: { hours: 0, minutes: 2, seconds: 10 },
    },
    {
      input: 3700,
      return: { hours: 1, minutes: 1, seconds: 40 },
    },
    {
      input: 7350,
      return: { hours: 2, minutes: 2, seconds: 30 },
    },
  ];

  it.each(testCases)("Calculate correct minutes and seconds", (testCase) => {
    expect(convertSecondsToHoursMinutesAndSeconds(testCase.input)).toEqual(
      testCase.return
    );
  });
});

describe("Calculate live scores", () => {
  it("calculates the correct live scores", () => {
    const gameLog: GameAction[] = [
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0)),
        value: 10,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 5)),
        value: 5,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 12)),
        value: 2,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 19)),
        value: -2,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 26)),
        value: 20,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 30)),
        value: 4,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
    ];

    const liveScores = calculateLiveScores(gameLog);

    expect(liveScores).toEqual([
      {
        playerId: "player1",
        points: 8,
      },
      {
        playerId: "player2",
        points: 25,
      },
      {
        playerId: "player3",
        points: 6,
      },
    ]);
  });
});

describe("Remove corrupt game actions", () => {
  const game: Game = {
    gameTypeId: "1",
    groupId: "1",
    adminId: "admin",
    players: [
      {
        playerId: "player1",
        points: 0,
      },
      {
        playerId: "player2",
        points: 0,
      },
      {
        playerId: "player3",
        points: 0,
      },
    ],
    timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 12, 59, 48)),
    status: "ONGOING",
  };

  it("Should not remove any elements", () => {
    const gameLog: Document<GameAction>[] = [
      {
        id: "1",
        actionType: GameActionType.START,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 12, 59, 50)),
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "2",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0)),
        value: 10,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "3",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 5)),
        value: 5,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "4",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 12)),
        value: 2,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "4",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 19)),
        value: -2,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "5",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 26)),
        value: 20,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "6",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 30)),
        value: 4,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
    ];

    const { updatedGameLog, nextPlayersTurn } = removeCorruptGameActions(
      game,
      gameLog
    );
    const liveScores = calculateLiveScores(updatedGameLog);

    expect(nextPlayersTurn).toEqual("player1");
    expect(liveScores).toEqual([
      {
        playerId: "player1",
        points: 8,
      },
      {
        playerId: "player2",
        points: 25,
      },
      {
        playerId: "player3",
        points: 6,
      },
    ]);
  });

  it("Should remove corrupt elements", () => {
    const gameLog: Document<GameAction>[] = [
      {
        id: "1",
        actionType: GameActionType.START,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 12, 59, 50)),
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "2",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0)),
        value: 10,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "3",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 5)),
        value: 5,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "4",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 12)),
        value: 2,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "4",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 19)),
        value: -2,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "5",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 26)),
        value: 20,
        subjectId: "player3",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "6",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 30)),
        value: 4,
        subjectId: "player2",
        gameId: "game1",
        actorId: "admin",
      },
      {
        id: "7",
        actionType: GameActionType.ADD_POINTS,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 13, 0, 30)),
        value: 4,
        subjectId: "player1",
        gameId: "game1",
        actorId: "admin",
      },
    ];

    const { updatedGameLog, nextPlayersTurn } = removeCorruptGameActions(
      game,
      gameLog
    );
    const liveScores = calculateLiveScores(updatedGameLog);

    expect(nextPlayersTurn).toEqual("player2");
    expect(liveScores).toEqual([
      {
        playerId: "player1",
        points: 14,
      },
      {
        playerId: "player2",
        points: 5,
      },
      {
        playerId: "player3",
        points: -2,
      },
    ]);
  });

  it("Game log is empty", () => {
    const gameLog: Document<GameAction>[] = [];

    const { updatedGameLog, nextPlayersTurn } = removeCorruptGameActions(
      game,
      gameLog
    );
    const liveScores = calculateLiveScores(updatedGameLog);

    expect(nextPlayersTurn).toEqual("player1");
    expect(liveScores).toEqual([]);
  });

  it("Game log only contains start action", () => {
    const gameLog: Document<GameAction>[] = [
      {
        id: "1",
        actionType: GameActionType.START,
        timestamp: Timestamp.fromDate(new Date(2023, 2, 2, 12, 59, 50)),
        gameId: "game1",
        actorId: "admin",
      },
    ];

    const { updatedGameLog, nextPlayersTurn } = removeCorruptGameActions(
      game,
      gameLog
    );
    const liveScores = calculateLiveScores(updatedGameLog);

    expect(nextPlayersTurn).toEqual("player1");
    expect(liveScores).toEqual([]);
  });
});
