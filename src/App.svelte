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
  <header class="max-w-7xl mx-auto px-8 py-4">
    <h1 class="text-4xl">{title}</h1>
  </header>

  <section
    class="grid gap-8 grid-cols-1 md:grid-cols-6 items-start max-w-7xl mx-auto px-8"
  >
    <NoteForm noteAdded={handleAddNewNote} />

    <ul class="flex flex-col gap-4 md:col-span-3 lg:col-span-4">
      {#each notes as note}
        {#if notes.length === 0}
          <li>No notes to display right now. 😴</li>
        {/if}
        <NoteItem {note} />
      {/each}
    </ul>
  </section>
</main>
