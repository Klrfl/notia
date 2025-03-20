<script lang="ts">
  import type { Note, NoteCategory } from "../types/"

  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import Tiptap from "@/lib/ui/Tiptap.svelte"

  import Pencil from "lucide-svelte/icons/pencil"
  import Copy from "lucide-svelte/icons/copy"

  interface Props {
    editedNote: Note
    editNote: (note: Note) => void
    categories: NoteCategory[]
  }

  const { categories, editedNote = $bindable(), editNote }: Props = $props()
</script>

<form
  method="dialog"
  class="grid grid-flow-dense gap-4"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    editNote(JSON.parse(JSON.stringify(editedNote)))
  }}
>
  <label for="title" class="sr-only">Title</label>
  <Input
    type="text"
    id="title"
    name="title"
    title="edit title"
    bind:value={editedNote.title}
    required
  />

  {#if categories?.length}
    <label for="input" class="sr-only">categories</label>

    <fieldset class="flex flex-wrap gap-2" id="input">
      {#each categories as category (category.id)}
        <label
          for={`${category.id}-${category.name}`}
          class="block px-3 py-1 cursor-pointer outline-2 outline-gray-200 has-focus-visible:outline-blue-500 has-checked:bg-blue-400 has-checked:outline-blue-500 has-checked:text-white select-none rounded-full"
        >
          {category.name}

          <input
            type="checkbox"
            class="block sr-only"
            id={`${category.id}-${category.name}`}
            value={category.id}
            bind:group={editedNote.categories}
          />
        </label>
      {/each}
    </fieldset>
  {/if}

  <label for="input" class="sr-only">content</label>

  <Tiptap
    class="focus-visible:outline focus-visible:outline-gray-500 p-4 md:min-h-80"
    bind:content={editedNote.content}
  />

  <p class="text-sm text-gray-600 order-last text-right">
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
