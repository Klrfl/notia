<script lang="ts">
  import Plus from "lucide-svelte/icons/plus"
  import Button from "./ui/Button.svelte"
  import type { InsertableNote } from "../types/"

  import { marked } from "marked"
  import DOMPurify from "dompurify"

  const { noteAdded } = $props()

  const newNote = $state<InsertableNote>({
    title: "",
    content: "",
  })
</script>

<form
  class="grid grid-cols-6 gap-4 rounded-lg"
  onsubmit={(e) => {
    e.preventDefault()
    noteAdded(newNote)
  }}
>
  <fieldset class="flex flex-col gap-4 col-span-full md:col-span-2">
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
    <textarea
      id="content"
      name="content"
      class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2 min-h-80"
      placeholder="your note's contents"
      required
      bind:value={newNote.content}
    >
    </textarea>
  </fieldset>

  <div class="preview bg-gray-100 p-4 col-span-full md:col-span-4">
    {#await marked.parse(newNote.content.trim())}
      <p>please wait</p>
    {:then parsed}
      {#if parsed.length}
        {@html DOMPurify.sanitize(parsed)}
      {:else}
        <p class="text-gray-400">Your note's contents will be rendered here.</p>
      {/if}
    {:catch}
      <p>something went wrong when rendering your note.</p>
    {/await}
  </div>

  <Button
    class="bg-blue-400 hover:bg-blue-500 text-white col-span-full md:col-span-2"
  >
    <Plus />
    Add new note
  </Button>
</form>
