// Import the function to test
import { getGroupsForCurrentUser } from "../../services/group.service";

// Mock the Firebase API
jest.mock("firebase", () => ({
  auth: jest.fn(() => ({
    currentUser: {
      uid: "test",
    },
  })),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      once: jest.fn(() =>
        Promise.resolve({
          val: () => ({
            group1: {
              name: "Bingo-gjengen",
              emoji: "🎰",
              games: [],
              invitationCode: "5673",
            },
            group2: {
              name: "Tennis-gutta",
              emoji: "🎾",
              games: [],
              invitationCode: "4822",
            },
            group3: {
              name: "Yatzy for life",
              emoji: "🎲",
              games: [],
              invitationCode: "5721",
            },
          }),
        })
      ),
    })),
  })),
}));

describe("getGroupsForCurrentUser", () => {
  it("should return an array of groups the current user is a member of", async () => {
    const groups = await getGroupsForCurrentUser("test");
    expect(groups).toHaveLength(3);
    expect(groups[0].name).toBe("Bingo-gjengen");
    expect(groups[1].name).toBe("Tennis-gutta");
    expect(groups[1].emoji).toBe("🎾");
  });
});
