<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import NoteEdit from "./lib/NoteEdit.svelte"
  import Dialog from "./lib/ui/Dialog.svelte"
  import Button from "./lib/ui/Button.svelte"
  import { Plus } from "lucide-svelte"

  let title = "Notia"

  const NOTES_LOCALSTORAGE_KEY = "notia-notes"
  const parsedNotes = JSON.parse(
    localStorage.getItem(NOTES_LOCALSTORAGE_KEY) ?? "[]"
  )

  let notes = $state<Note[]>(parsedNotes)

  let isAddingNote = $state(false)
  const handleAddNewNote = (note: InsertableNote) => {
    notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() })
    isAddingNote = false
  }

  $effect(() => {
    localStorage.setItem(NOTES_LOCALSTORAGE_KEY, JSON.stringify(notes))
  })

  let editedNote = $state<Note>()
  let isEditingNote = $state(false)

  const initiateEditNote = (note: Note) => {
    editedNote = note
    isEditingNote = true
  }

  const handleEditNote = (note: Note) => {
    const noteLocation = notes.indexOf(note)
    notes.splice(noteLocation, 1, {
      ...note,
      updatedAt: new Date(),
    })

    isEditingNote = false
  }

  const handleDeleteNote = (noteId: Note["id"]) => {
    notes = notes.filter((note) => note.id !== noteId)
  }
</script>

<main>
  <header class="px-8 py-4">
    <h1 class="text-4xl">{title}</h1>

    <Button onclick={() => (isAddingNote = true)}>
      <Plus />
      Add new note
    </Button>

    <Dialog bind:isOpen={isAddingNote} heading="Add new note">
      <NoteForm noteAdded={handleAddNewNote} />
    </Dialog>
  </header>

  <section class="px-8">
    <ul class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {#each notes as note}
        {#if notes.length === 0}
          <li>No notes to display right now. 😴</li>
        {/if}
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
