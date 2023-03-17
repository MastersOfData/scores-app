import { generateUserGroupStatisticDocumentId } from "../util";

describe("generateUserGroupStatisticDocumentId", () => {
  it.each([
    ["asd","123","asd-123"],
    ["a","b","a-b"],
    ["asd","","asd-"]
  ])('Should return correct value', (userId, groupId, expected) => {
    const result = generateUserGroupStatisticDocumentId(userId, groupId);
    expect(result).toBe(expected);
  });

  it.each([
    ["asd","123"],
    ["a","b"],
    ["asd",""]
  ])('Should return correct type', (userId, groupId) => {
    const result = generateUserGroupStatisticDocumentId(userId, groupId);
    expect(typeof result).toBe("string");
  })
})