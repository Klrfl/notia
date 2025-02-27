<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"

  let title = "Notia"

  const notes = $state<Note[]>([
    {
      id: 1,
      title: "a note",
      content: "i would like to learn svelte.. like right now",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "another note",
      content: "finish this markdown notetaking app",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ])

  const handleAddNewNote = (note: InsertableNote) => {
    notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() })
  }
</script>

<main>
  <h1>{title}</h1>

  <NoteForm noteAdded={handleAddNewNote} />

  <ul>
    {#each notes as note}
      <NoteItem {note} />
    {/each}
  </ul>
</main>
