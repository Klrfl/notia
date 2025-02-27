<script lang="ts">
  import type { InsertableNote } from "../types/"

  const { noteAdded } = $props()

  const newNote = $state<InsertableNote>({
    id: Math.round(Math.random() * 10),
    title: "",
    content: "",
  })
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    noteAdded(newNote)
  }}
>
  <label for="title">title</label>
  <input
    type="text"
    id="title"
    name="title"
    placeholder="title"
    required
    bind:value={newNote.title}
  />

  <label for="content">content</label>
  <input
    type="text"
    id="content"
    name="content"
    placeholder="your note's contents"
    required
    bind:value={newNote.content}
  />

  <button type="submit">Add new note</button>
</form>

<style>
  form {
    outline: 2px solid #efefef;
  }

  form :is(input, label, button) {
    display: block;
    padding: 1rem 1.5rem;
  }
</style>
