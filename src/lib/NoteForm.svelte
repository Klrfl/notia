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
  class="bg-white outline outline-gray-200 p-4 flex flex-col gap-4 rounded-lg md:col-span-3 lg:col-span-2"
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
    class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2"
    required
    bind:value={newNote.title}
  />

  <label for="content">content</label>
  <input
    type="text"
    id="content"
    name="content"
    class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2"
    placeholder="your note's contents"
    required
    bind:value={newNote.content}
  />

  <button
    type="submit"
    class="px-6 py-4 cursor-pointer bg-blue-400 hover:bg-blue-500 text-white"
    >Add new note</button
  >
</form>
