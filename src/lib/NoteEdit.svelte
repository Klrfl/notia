<script lang="ts">
  import Button from "./ui/Button.svelte"
  import type { Note } from "../types/"

  import { marked } from "marked"
  import DOMPurify from "dompurify"
  import { Pencil, Copy } from "lucide-svelte"

  interface Props {
    editedNote: Note
    editNote: (note: Note) => void
  }

  const { editedNote = $bindable(), editNote }: Props = $props()
</script>

<form
  method="dialog"
  class="grid grid-cols-6 grid-flow-dense gap-4"
  onsubmit={() => {
    editNote(editedNote)
  }}
>
  <fieldset class="flex flex-col gap-4 col-span-2">
    <label for="title">Title</label>
    <input
      type="text"
      id="title"
      name="title"
      class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2"
      bind:value={editedNote.title}
      required
    />

    <label for="content">
      content
      <p class="text-sm text-gray-600">Format your text in markdown.</p>
    </label>

    <textarea
      class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2 min-h-80"
      id="content"
      name="content"
      bind:value={editedNote.content}
      required
    >
    </textarea>
  </fieldset>

  <div class="preview bg-gray-100 p-4 col-span-4">
    {#await marked.parse(editedNote.content)}
      <p>please wait</p>
    {:then parsed}
      {@html DOMPurify.sanitize(parsed)}
    {:catch}
      <p>something went wrong when rendering your note.</p>
    {/await}
  </div>

  <p class="text-sm text-gray-600 order-last text-right col-span-4">
    <span class="block">
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(editedNote.createdAt))}
    </span>

    <span>
      updated at

      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(editedNote.updatedAt))}
    </span>
  </p>

  <Button class="bg-blue-400 hover:bg-blue-500 text-white text-sm">
    <Pencil size="1rem" />
    Edit note
  </Button>

  <Button
    onclick={() => navigator.clipboard.writeText(editedNote.content)}
    class="outline outline-gray-200 hover:bg-gray-200 text-sm"
  >
    <Copy size="1rem" />
    Copy note as text
  </Button>
</form>

<style>
  @reference "../app.css";

  :global(.preview :is(h1, h2, h3, h4, h5, h6)) {
    @apply font-bold;
  }

  :global(.preview h1) {
    @apply text-3xl;
  }

  :global(.preview h2) {
    @apply text-2xl;
  }
  :global(.preview h3) {
    @apply text-xl;
  }

  :global(.preview h4) {
    @apply text-lg;
  }

  :global(.preview h6) {
    @apply italic;
  }

  :global(.preview :is(ul, li)) {
    @apply list-disc;
  }

  :global(.preview ul) {
    @apply ml-4 my-4;
  }
</style>
