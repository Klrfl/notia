<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"

  let title = "Notia"

  const NOTES_LOCALSTORAGE_KEY = "notia-notes"
  const parsedNotes = JSON.parse(
    localStorage.getItem(NOTES_LOCALSTORAGE_KEY) ?? "[]"
  )
  const notes = $state<Note[]>(parsedNotes)

  const handleAddNewNote = (note: InsertableNote) => {
    notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() })

    localStorage.setItem(NOTES_LOCALSTORAGE_KEY, JSON.stringify(notes))
  }
</script>

<main>
  <h1>{title}</h1>

  <NoteForm noteAdded={handleAddNewNote} />

  <ul>
    {#each notes as note}
      {#if notes.length === 0}
        <li>No notes to display right now. 😴</li>
      {/if}
      <NoteItem {note} />
    {/each}
  </ul>
</main>
