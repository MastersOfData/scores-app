import {
  differenceBetweenFirestoreTimestampsInDays,
  generateUserGroupStatisticDocumentId,
} from "../util";
import { Timestamp } from "firebase/firestore";

describe("generateUserGroupStatisticDocumentId", () => {
  it.each([
    ["asd", "123", "asd-123"],
    ["a", "b", "a-b"],
    ["asd", "", "asd-"],
  ])("Should return correct value", (userId, groupId, expected) => {
    const result = generateUserGroupStatisticDocumentId(userId, groupId);
    expect(result).toBe(expected);
  });

  it.each([
    ["asd", "123"],
    ["a", "b"],
    ["asd", ""],
  ])("Should return correct type", (userId, groupId) => {
    const result = generateUserGroupStatisticDocumentId(userId, groupId);
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
