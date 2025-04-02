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
  trashedAt: Date | null
  categories?: Array<NoteCategory["id"]>
}

export type InsertableNote = Pick<Note, "title" | "content" | "categories">
