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
  DocumentReference,
  updateDoc,
  getDoc,
  UpdateData,
  getDocs,
  setDoc
} from "firebase/firestore"

// Constants
export const usersCol = "users";
export const groupsCol = "groups";
export const gamesCol = "games";
export const userGroupStatisticsCol = "user_group_statistics";

// Types
type Document<T extends DocumentData> = T & { id: string }

type Collection = typeof usersCol | typeof groupsCol | typeof gamesCol | typeof userGroupStatisticsCol

type QueryDefinition = {
  collectionId: Collection,
  constraints?: QueryConstraint[]
}

// Functions
export function subscribeToDoc<T extends DocumentData>(collectionId: Collection, docId: string, observer: (document: Document<T> | null) => void) {
  const docRef = doc(db, collectionId, docId) as DocumentReference<T>
  return onSnapshot(docRef, snapshot => {
    const id = snapshot.id
    const data = snapshot.data()
    const document = data ? { id, ...data } as Document<T> : null
    observer(document)
  })
}

export function subscribeToDocuments<T extends DocumentData>({ collectionId, constraints }: QueryDefinition, observer: (documents: Document<T>[]) => void) {
  const collectionRef = collection(db, collectionId) as CollectionReference<T>
  const _constraints = constraints || []
  const q = query(collectionRef, ..._constraints)
  return onSnapshot(q, snapshot => {
    const documents = snapshot.docs.map(_doc => {
      const id = _doc.id
      const data = _doc.data()
      return { id, ...data }
    })
    observer(documents)
  })
}

export async function addDocument<T extends DocumentData>(collectionId: Collection, data: T) {
  const collectionRef = collection(db, collectionId) as CollectionReference<T>
  return await addDoc(collectionRef, data)
}

export async function setDocument<T extends DocumentData>(collectionId: Collection, docId: string, data: T) {
  const docRef = doc(db, collectionId, docId) as DocumentReference<T>
  return await setDoc(docRef, data)
}

export async function deleteDocument(collectionId: Collection, docId: string) {
  const docRef = doc(db, collectionId, docId)
  return await deleteDoc(docRef)
}

export async function updateDocument<T extends DocumentData>(collectionId: Collection, docId: string, updateData: UpdateData<T>) {
  const docRef = doc(db, collectionId, docId) as DocumentReference<T>
  return await updateDoc(docRef, updateData)
}

export async function getDocument<T extends DocumentData>(collectionId: Collection, docId: string) {
  const docRef = doc(db, collectionId, docId) as DocumentReference<T>
  const snapshot = await getDoc(docRef)
  const id = snapshot.id
  const data = snapshot.data()
  return data ? { id, ...data } as Document<T> : null
}

export async function getDocuments<T extends DocumentData>({ collectionId, constraints }: QueryDefinition) {
  const collectionRef = collection(db, collectionId) as CollectionReference<T>
  const _constraints = constraints || []
  const q = query(collectionRef, ..._constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(_doc => {
    return {
      id: _doc.id,
      ..._doc.data()
    } as Document<T>
  })
}