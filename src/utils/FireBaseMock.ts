import firebase from 'firebase/app';
import 'firebase/firestore';

jest.mock('firebase/app');

const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  add: jest.fn(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};

const mockFirebase = {
  firestore: jest.fn().mockReturnValue(mockFirestore),
};

firebase.initializeApp = jest.fn();
firebase.firestore = jest.fn().mockReturnValue(mockFirestore);

export { mockFirebase, mockFirestore };
