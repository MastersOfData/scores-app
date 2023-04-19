import { db } from "./config"
import {
  onSnapshot,
  doc,
  collection,
  CollectionReference,
  DocumentData,
  QueryConstraint,
  query,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  UpdateData,
  getDocs,
  setDoc
} from "firebase/firestore"
import type { Game, GameAction, Group, Membership, User } from "./models";

// Collections
export const collections = {
  users: createCollection<User>("users"),
  groups: createCollection<Group>("groups"),
  games: createCollection<Game>("games"),
  gameActions: createCollection<GameAction>("gameActions"),
  memberships: createCollection<Membership>("memberships")
}

// Types
export type Document<T extends DocumentData> = T & { id: string }

export type QueryDefinition<T extends DocumentData> = {
  collection: CollectionReference<T>,
  constraints?: QueryConstraint[]
}

// Functions
export function subscribeToDocument<T extends DocumentData>(collection: CollectionReference<T>, docId: string, observer: (document: Document<T> | null) => void) {
  const docRef = doc(collection, docId)
  return onSnapshot(docRef, snapshot => {
    const id = snapshot.id
    const data = snapshot.data()
    const document = data ? { id, ...data } as Document<T> : null
    observer(document)
  })
}

export function subscribeToDocuments<T extends DocumentData>({ collection, constraints }: QueryDefinition<T>, observer: (documents: Document<T>[]) => void) {
  const _constraints = constraints ?? []
  const q = query(collection, ..._constraints)
  return onSnapshot(q, snapshot => {
    const documents = snapshot.docs.map(_doc => {
      const id = _doc.id
      const data = _doc.data()
      return { id, ...data }
    })
    observer(documents)
  })
}

export async function addDocument<T extends DocumentData>(collection: CollectionReference<T>, data: T) {
  return await addDoc(collection, data)
}

export async function setDocument<T extends DocumentData>(collection: CollectionReference<T>, docId: string, data: T) {
  const docRef = doc(collection, docId)
  return await setDoc(docRef, data)
}

export async function deleteDocument<T extends DocumentData>(collection: CollectionReference<T>, docId: string) {
  const docRef = doc(collection, docId)
  return await deleteDoc(docRef)
}

export async function updateDocument<T extends DocumentData>(collection: CollectionReference<T>, docId: string, updateData: UpdateData<T>) {
  const docRef = doc(collection, docId)
  return await updateDoc(docRef, updateData)
}

export async function getDocument<T extends DocumentData>(collection: CollectionReference<T>, docId: string) {
  const docRef = doc(collection, docId)
  const snapshot = await getDoc(docRef)
  const id = snapshot.id
  const data = snapshot.data()
  return data ? { id, ...data } as Document<T> : null
}

export async function getDocuments<T extends DocumentData>({ collection, constraints }: QueryDefinition<T>) {
  const _constraints = constraints || []
  const q = query(collection, ..._constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(_doc => {
    return {
      id: _doc.id,
      ..._doc.data()
    } as Document<T>
  })
}

// Helper functions
function createCollection<T extends DocumentData>(collectionId: string) {
  return collection(db, collectionId) as CollectionReference<T>
}