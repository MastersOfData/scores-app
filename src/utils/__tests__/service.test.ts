import firebase from "firebase/app"
import { collection, Firestore } from "firebase/firestore"
import { mockCollection } from "firestore-jest-mock/mocks/firestore"
import { groupsCol, usersCol, gamesCol, userGroupStatisticsCol } from "../../fire-base/db"
import { AppProps } from "next/app"
import { db } from "../../fire-base/config"
import { mockFirebase } from "firestore-jest-mock";
import { createGroup } from "../../services/group.service";
import { Group } from "../../fire-base/models";

const group1: Group = {
  name: "BestGroup",
  emoji: "🤓",
  games: ["sjakk"],
  invitationCode: "",
  gameTypes: [],
};

const mockCreateGroup = jest.fn(createGroup);

describe("createGroup", () => {
  beforeAll(() => {
    mockFirebase({
      database: {
        groupsCol: [
          { group: group1, id: "123" },
        ],
      },
    });
  });

  it("should create a new group", async () => {
    const newGroup: Group = {
      name: "NewGroup",
      emoji: "😎",
      games: ["monopol", "yatzy"],
      invitationCode: "",
      gameTypes: [],
    };

    await mockCreateGroup(newGroup);
    expect(mockCreateGroup).toHaveBeenCalled();

    // Verify that the new group has been added to the firestore mock database
    const db = mockFirebase.firestore();
    const querySnapshot = await db.collection("groups").get();
    const docs = querySnapshot.docs.map((doc) => doc.data() as Group);
    expect(docs).toContainEqual(newGroup);
  });
});





/*


import { createGroup } from "../../services/group.service";
import { addDoc, collection, getDoc } from "firebase/firestore";
//import { addDocument, setDocument, Collct } from "src/fire-base/db";



jest.mock("firebase/app", () => {
  return {
    initializeApp: jest.fn(),
  };
});

jest.mock("firebase/firestore", () => {
  const firebaseFirestoreMock = {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
  };

  return {
    collection: jest.fn(() => firebaseFirestoreMock),
    doc: jest.fn(() => firebaseFirestoreMock),
    getDoc: jest.fn(() => firebaseFirestoreMock),
    getDocs: jest.fn(() => firebaseFirestoreMock),
    addDoc: jest.fn(() => firebaseFirestoreMock),
    firestore: jest.fn(() => firebaseFirestoreMock),
  };
});

describe("createGroup", () => {
  const db = collection(null as any, "dummy");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new group", async () => {
    const currentUserId = "user123";
    const groupName = "Test Group";
    const emoji = "🔥";

    const mockGroupRef = {
      id: "group123",
    };
    const mockGroupData = {
      name: groupName,
      emoji,
      games: [],
      invitationCode: "",
      gameTypes: [],
    };
    const mockGroupDocRef = {
      id: "doc123",
      data: jest.fn(() => mockGroupData),
    };

    const mockJoinGroup = jest.fn();
    const mockGetGroupInternal = jest.fn(() => mockGroupData);

    // Mock Firestore calls
    (addDoc as jest.Mock).mockResolvedValueOnce(mockGroupRef);
    (getDoc as jest.Mock).mockResolvedValueOnce(mockGroupDocRef);

    const result = await createGroup(currentUserId, groupName, emoji);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(db, mockGroupData);
    expect(mockJoinGroup).toHaveBeenCalledTimes(1);
    expect(mockJoinGroup).toHaveBeenCalledWith(mockGroupRef.id, currentUserId);
    expect(mockGetGroupInternal).toHaveBeenCalledTimes(1);
    expect(mockGetGroupInternal).toHaveBeenCalledWith(mockGroupRef.id);
    expect(result).toEqual(mockGroupData);
  });
});

*/