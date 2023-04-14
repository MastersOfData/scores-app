import {
  calculateDuration,
  convertSecondsToMinutesAndSeconds,
  differenceBetweenFirestoreTimestampsInDays,
  generateMembershipDocumentId,
} from "../util";
import { Timestamp } from "firebase/firestore";
import { Game } from "src/fire-base/models";

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
      return: { minutes: 6, seconds: 0 },
    },
    {
      input: 50,
      return: { minutes: 0, seconds: 50 },
    },
    {
      input: 130,
      return: { minutes: 2, seconds: 10 },
    },
  ];

  it.each(testCases)("Calculate correct minutes and seconds", (testCase) => {
    expect(convertSecondsToMinutesAndSeconds(testCase.input)).toEqual(
      testCase.return
    );
  });
});