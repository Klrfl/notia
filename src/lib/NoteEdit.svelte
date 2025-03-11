<script lang="ts">
  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import type { Note, NoteCategory } from "../types/"

  import Pencil from "lucide-svelte/icons/pencil"
  import Copy from "lucide-svelte/icons/copy"
  import Eye from "lucide-svelte/icons/eye"

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

  let isMobile = $state(false)
  window.addEventListener(
    "resize",
    () => (isMobile = window.matchMedia("(max-width: 768px)").matches)
  )
  onMount(() => (isMobile = window.matchMedia("(max-width: 768px)").matches))

  let textarea: HTMLTextAreaElement | undefined = $state()
  let showPreview = $state(false)
</script>

<form
  method="dialog"
  class="grid md:grid-cols-6 grid-flow-dense md:gap-4"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    editNote(JSON.parse(JSON.stringify(editedNote)))
  }}
>
  <fieldset class="flex flex-col gap-4 col-span-full md:col-span-2">
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

    {#if isMobile}
      <div class="flex">
        <button
          type="button"
          onclick={() => (showPreview = false)}
          disabled={!showPreview}
          class="preview-toggle input"
        >
          <Pencil />
          input
        </button>

        <button
          type="button"
          onclick={() => (showPreview = true)}
          disabled={showPreview}
          class="preview-toggle preview"
        >
          <Eye />
          preview
        </button>
      </div>
    {/if}

    {#if !isMobile || !showPreview}
      <textarea
        bind:this={textarea}
        class="bg-gray-200/50 focus-visible:outline focus-visible:outline-gray-500 p-4 md:min-h-80"
        rows={textarea ? Math.round(textarea.clientHeight / 12) : 0}
        id="content"
        name="content"
        bind:value={editedNote.content}
        required
      >
      </textarea>
    {/if}
  </fieldset>

  {#if !isMobile || showPreview}
    <div class="preview bg-gray-100 p-4 md:col-span-4">
      {#await marked.parse(editedNote.content.trim()) then parsed}
        {@html DOMPurify.sanitize(parsed)}
      {:catch}
        <p>something went wrong when rendering your note.</p>
      {/await}
    </div>
  {/if}

  <p class="text-sm text-gray-600 order-last text-right md:col-span-4">
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

  .preview-toggle {
    border-top: transparent;
    border-bottom: transparent;
    @apply flex gap-4 px-4 py-2 cursor-pointer bg-gray-200/50 border-2 border-t-slate-200 not-disabled:bg-gray-300 not-disabled:text-gray-600 disabled:cursor-not-allowed;
  }

  .preview-toggle.input {
    @apply border-l-slate-200;
    border-right: transparent;
  }

  .preview-toggle.preview {
    @apply border-l-slate-200 border-r-slate-200;
  }
</style>
