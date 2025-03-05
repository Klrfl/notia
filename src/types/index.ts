export interface NoteCategory {
  id: number
  name: string
}

export interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type InsertableNote = Omit<Note, "id" | "createdAt" | "updatedAt">
