<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
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

  const newNote = $state<InsertableNote>({
    id: Math.round(Math.random() * 10),
    title: "",
    content: "",
  })

  const handleAddNewNote = (note: InsertableNote) => {
    notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() })
  }
</script>

<main>
  <h1>{title}</h1>

  <form
    onsubmit={(e) => {
      e.preventDefault()
      handleAddNewNote(newNote)
    }}
  >
    <label for="title">title</label>
    <input
      type="text"
      placeholder="title"
      required
      bind:value={newNote.title}
    />
    <label for="content">content</label>
    <input
      type="text"
      placeholder="your note's contents"
      required
      bind:value={newNote.content}
    />

    <button type="submit">Add new note</button>
  </form>

  <ul>
    {#each notes as note}
      <li>
        <h2>{note.title}</h2>
        <p>{note.content}</p>

        <p>
          Created at {Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(note.createdAt)}
        </p>
        <p>
          Last updated at {Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(note.updatedAt)}
        </p>
      </li>
    {/each}
  </ul>
</main>

<style>
  form {
    outline: 2px solid #efefef;
  }

  form :is(input, label, button) {
    display: block;
    padding: 1rem 1.5rem;
  }
</style>
