import type { InsertableNote, Note, NoteCategory } from "@/types"
import { openDB } from "./db.svelte"

export class NoteService {
  db: IDBDatabase
  notes: Note[] = $state([])

  constructor(db: IDBDatabase) {
    this.db = db
  }

  getAllNotes() {
    const notesTx = this.db.transaction("notes")
    const notesReq = notesTx.objectStore("notes").getAll()

    notesReq.addEventListener("success", () => {
      this.notes = notesReq.result
    })

    return this.notes
  }

  addNewNote(note: InsertableNote): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      const notesStore = this.db
        ?.transaction("notes", "readwrite")
        .objectStore("notes")

      const newNote = {
        ...note,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const newNoteReq = notesStore?.add(structuredClone(newNote))

      newNoteReq?.addEventListener("success", () => {
        const returnNewNote = notesStore?.get(newNoteReq.result)

        returnNewNote?.addEventListener("success", () => {
          this.notes.push(returnNewNote.result)
          return resolve(this.notes)
        })
      })

      newNoteReq?.addEventListener("error", () => {
        alert("there was an error adding a new note.")
        return reject(newNoteReq.error)
      })
    })
  }

  editNote(editedNote: Note) {
    return new Promise((resolve) => {
      const notesStore = this.db
        ?.transaction("notes", "readwrite")
        .objectStore("notes")

      const newNote: Note = {
        ...editedNote,
        updatedAt: new Date(),
      }

      const request = notesStore?.put(structuredClone(newNote))

      request?.addEventListener("success", () => {
        const noteLocation = this.notes.find(({ id }) => id === editedNote.id)
        if (!noteLocation) return alert("can't edit your note for some reason.")

        this.notes.splice(this.notes.indexOf(noteLocation), 1, newNote)
        return resolve(this.notes)
      })
    })
  }

  deleteNoteCategories(categoryId: NoteCategory["id"]) {
    return new Promise((resolve) => {
      const notesTx = this.db?.transaction("notes", "readwrite")
      const cursorReq = notesTx?.objectStore("notes")?.openCursor()

      cursorReq?.addEventListener("success", () => {
        const cursor = cursorReq.result
        if (!cursor) return

        const newNote = cursor.value as Note
        newNote.categories = newNote.categories?.filter((c) => c !== categoryId)
        const req = notesTx?.objectStore("notes").put(newNote)

        // sync note state with db
        req.addEventListener("success", () => {
          const existingNote = this.notes.find((n) => n.id === newNote.id)
          if (!existingNote) {
            return console.error(
              "error occured when syncing database and application state."
            )
          }

          this.notes.splice(this.notes.indexOf(existingNote), 1, newNote)
        })

        cursor.continue()
      })

      return resolve(this.notes)
    })
  }

  deleteNote(noteId: Note["id"]) {
    return new Promise((resolve) => {
      const notesStore = this.db?.transaction("notes", "readwrite")
      const notesObjectStore = notesStore?.objectStore("notes")
      notesObjectStore?.delete(noteId)

      this.notes = this.notes.filter((note) => note.id !== noteId)
      return resolve(this.notes)
    })
  }

  categorizeNotes(
    selectedNotes: Array<Note["id"]>,
    newCategory: Array<NoteCategory["id"]>
  ) {
    return new Promise((resolve, reject) => {
      const notesTx = this.db.transaction("notes", "readwrite")
      const notesStore = notesTx.objectStore("notes")

      // TODO: refactor to use indexedDB indices to filter
      // through objects instead of doing it in code
      const cursorReq = notesStore.openCursor()

      cursorReq.addEventListener("success", () => {
        const cursor = cursorReq.result
        if (!cursor) return

        const note = cursor.value as Note
        if (!selectedNotes.includes(note.id)) return cursor.continue()

        note.categories = Array.from(
          new Set([...(note.categories ?? []), ...newCategory])
        )

        const updateReq = notesStore.put(note)

        updateReq.addEventListener("success", () => {
          const targetNote = this.notes.find(({ id }) => id === note.id)
          if (!targetNote) {
            return reject("failed to categorize notes")
          }

          this.notes.splice(this.notes.indexOf(targetNote), 1, note)
          return resolve(this.notes)
        })

        cursor.continue()
      })
    })
  }

  deleteNotes(noteIds: Note["id"][]) {
    console.log(noteIds)
  }
}

const db = await openDB()
export const noteService = new NoteService(db)

export const selectedCategories: number[] = $state([])

const filteredNotes = $derived(
  !selectedCategories.length
    ? noteService?.getAllNotes()
    : noteService?.getAllNotes().filter((note) => {
        return (
          note.categories &&
          note.categories?.some((category) =>
            selectedCategories.includes(category)
          )
        )
      })
)

export const getFilteredNotes = () => filteredNotes
