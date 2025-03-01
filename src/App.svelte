<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import NoteEdit from "./lib/NoteEdit.svelte"
  import Dialog from "./lib/ui/Dialog.svelte"
  import Button from "./lib/ui/Button.svelte"
  import { Plus } from "lucide-svelte"

  let title = "Notia"

  let db = $state<IDBDatabase>()
  const openRequest = window.indexedDB.open("testDB")

  openRequest.addEventListener("upgradeneeded", () => {
    db = openRequest.result
    if (import.meta.env.DEV) console.log("no database yet...", openRequest)

    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", {
        keyPath: "id",
        autoIncrement: true,
      })
    }
  })

  let notes = $state<Note[]>([])

  openRequest.addEventListener("success", () => {
    db = openRequest.result
    if (import.meta.env.DEV) console.log("established connection to database.")

    const tx = db.transaction("notes")
    const store = tx.objectStore("notes")
    const notesRequest = store.openCursor()

    notesRequest.addEventListener("success", () => {
      const cursor = notesRequest.result

      if (!cursor) return

      notes.push(cursor.value)
      cursor.continue()
    })
  })

  let isAddingNote = $state(false)

  const handleAddNewNote = (note: InsertableNote) => {
    isAddingNote = false

    const notesStore = db
      ?.transaction("notes", "readwrite")
      .objectStore("notes")

    const newNote = {
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const request = notesStore?.add(structuredClone(newNote))

    request?.addEventListener("success", () => {
      const newNoteReq = notesStore?.get(request.result)

      newNoteReq?.addEventListener("success", () =>
        notes.push(newNoteReq.result)
      )
    })

    request?.addEventListener("error", () => {
      alert("there was an error adding a new note.")
      console.error(request.error)
    })
  }

  let editedNote = $state<Note>()
  let isEditingNote = $state(false)

  const initiateEditNote = (note: Note) => {
    editedNote = note
    isEditingNote = true
  }

  const handleEditNote = (note: Note) => {
    const notesStore = db
      ?.transaction("notes", "readwrite")
      .objectStore("notes")

    const newNote: Note = {
      ...note,
      updatedAt: new Date(),
    }

    notesStore?.put(structuredClone(newNote))

    const noteLocation = notes.indexOf(note)
    notes.splice(noteLocation, 1, newNote)

    isEditingNote = false
  }

  const handleDeleteNote = (noteId: Note["id"]) => {
    const notesStore = db?.transaction("notes", "readwrite")
    const notesObjectStore = notesStore?.objectStore("notes")
    notesObjectStore?.delete(noteId)

    notes = notes.filter((note) => note.id !== noteId)
  }
</script>

<main class="flex">
  <nav class="min-w-max bg-white outline outline-gray-200 min-h-screen">
    <header class="px-8 py-4">
      <h1 class="text-4xl">{title}</h1>

      <Button icon onclick={() => (isAddingNote = true)}>
        <Plus />
        Add new note
      </Button>

      <Dialog bind:isOpen={isAddingNote} heading="Add new note">
        <NoteForm noteAdded={handleAddNewNote} />
      </Dialog>
    </header>
  </nav>

  <section class="p-8">
    <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {#if !notes.length}
        <li>No notes to display right now. 😴</li>
      {/if}

      {#each notes as note (note.id)}
        <NoteItem
          {note}
          editNote={initiateEditNote}
          deleteNote={handleDeleteNote}
        />
      {/each}
    </ul>
  </section>

  <Dialog bind:isOpen={isEditingNote} heading="Edit note">
    {#if editedNote}
      <NoteEdit bind:editedNote editNote={handleEditNote} />
    {/if}
  </Dialog>
</main>
