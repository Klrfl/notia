<script lang="ts">
  import { Pencil, Copy } from "lucide-svelte"
  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import type { Note, NoteCategory } from "../types/"

  import { marked } from "marked"
  import DOMPurify from "dompurify"
  import { onMount } from "svelte"
  import { openDB } from "../shared/db.svelte"

  interface Props {
    editedNote: Note
    editNote: (note: Note) => void
  }

  const { editedNote = $bindable(), editNote }: Props = $props()

  let categories: NoteCategory[] = $state([])

  onMount(async () => {
    const db = await openDB()
    const tx = db.transaction("categories")
    const req = tx.objectStore("categories").getAll()

    req.addEventListener("success", () => (categories = req.result))
  })

  let selectedCategories = $state([])
</script>

<form
  method="dialog"
  class="grid grid-cols-6 grid-flow-dense gap-4"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    editNote(JSON.parse(JSON.stringify(editedNote)))
  }}
>
  <fieldset class="flex flex-col gap-4 col-span-2">
    <label for="title">Title</label>
    <Input
      type="text"
      id="title"
      name="title"
      bind:value={editedNote.title}
      required
    />

    <fieldset class="grid grid-cols-subgrid">
      <legend>categories</legend>

      {#if categories?.length}
        <div class="flex flex-wrap gap-2">
          {#each categories as category (category.id)}
            <label
              for={`${category.id}-${category.name}`}
              class="px-3 py-1 cursor-pointer outline-2 outline-gray-200 has-focus-visible:outline-blue-500 has-checked:bg-blue-400 has-checked:outline-blue-500 has-checked:text-white select-none rounded-full"
            >
              {category.name}

              <input
                type="checkbox"
                class="sr-only"
                id={`${category.id}-${category.name}`}
                value={category.id}
                bind:group={editedNote.categories}
              />
            </label>
          {/each}
        </div>
      {/if}
    </fieldset>

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
    {#await marked.parse(editedNote.content.trim())}
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

  <Button icon size="sm">
    <Pencil size="1rem" />
    Edit note
  </Button>

  <Button
    onclick={() => navigator.clipboard.writeText(editedNote.content)}
    icon
    variant="outline"
    size="sm"
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
