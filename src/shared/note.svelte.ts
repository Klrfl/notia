import type { InsertableNote, Note } from "@/types"

export class NoteService {
  db: IDBDatabase
  notes: Note[] = $state([])

  constructor(db: IDBDatabase) {
    this.db = db
  }

  getAllNotes() {
    return new Promise((resolve) => {
      const notesTx = this.db.transaction("notes")
      const notesReq = notesTx.objectStore("notes").getAll()

      notesReq.addEventListener("success", () => {
        this.notes = notesReq.result
      })

      return resolve(this.notes)
    })
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

  deleteNote(noteId: Note["id"]) {
    return new Promise((resolve) => {
      const notesStore = this.db?.transaction("notes", "readwrite")
      const notesObjectStore = notesStore?.objectStore("notes")
      notesObjectStore?.delete(noteId)

      this.notes = this.notes.filter((note) => note.id !== noteId)
      return resolve(this.notes)
    })
  }
}
