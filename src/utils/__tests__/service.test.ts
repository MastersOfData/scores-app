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
