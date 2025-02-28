<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import NoteEdit from "./lib/NoteEdit.svelte"
  import Dialog from "./lib/ui/Dialog.svelte"
  import Button from "./lib/ui/Button.svelte"
  import { Plus } from "lucide-svelte"
  import { onMount } from "svelte"
  import { openDB } from "./shared/db.svelte"

  let title = "Notia"

  let db = $state<IDBDatabase>()
  let notes = $state<Note[]>([])

  onMount(async () => {
    try {
      db = await openDB()
    } catch (error) {
      console.error("no database found")
      return console.trace(error)
    }

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

    const newNoteReq = notesStore?.add(structuredClone(newNote))

    newNoteReq?.addEventListener("success", () => {
      const returnNewNote = notesStore?.get(newNoteReq.result)

      returnNewNote?.addEventListener("success", () =>
        notes.push(returnNewNote.result)
      )
    })

    newNoteReq?.addEventListener("error", () => {
      alert("there was an error adding a new note.")
      console.error(newNoteReq.error)
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

    const request = notesStore?.put(structuredClone(newNote))

    request?.addEventListener("success", () => {
      const noteLocation = notes.indexOf(note)
      notes.splice(noteLocation, 1, newNote)

      isEditingNote = false
    })
  }

  const handleDeleteNote = (noteId: Note["id"]) => {
    const notesStore = db?.transaction("notes", "readwrite")
    const notesObjectStore = notesStore?.objectStore("notes")
    notesObjectStore?.delete(noteId)

    notes = notes.filter((note) => note.id !== noteId)
  }

  $effect(() => {
    localStorage.setItem(NOTES_LOCALSTORAGE_KEY, JSON.stringify(notes))
  })

  let dialog = $state<HTMLDialogElement>()

  let editedNote = $state<Note>()

  const initiateEditNote = (note: Note) => {
    if (!dialog) return
    editedNote = note

    dialog.showModal()
  }

  const closeEditNote = () => {
    if (!dialog) return
    dialog.close()
  }

  const handleEditNote = (note: Note) => {
    const noteLocation = notes.indexOf(note)
    notes.splice(noteLocation, 1, note)
  }

  const handleDeleteNote = (noteId: Note["id"]) => {
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
