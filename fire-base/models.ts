import type { DocumentData } from "firebase/firestore"

// id is not part of document data
export interface Example extends DocumentData {
  name: string,
  age: number
}