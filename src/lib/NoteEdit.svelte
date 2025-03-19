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
  class="grid grid-flow-dense md:gap-4"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    editNote(JSON.parse(JSON.stringify(editedNote)))
  }}
>
  <fieldset class="flex flex-col gap-4 col-span-full">
    <label for="title">Title</label>
    <Input
      type="text"
      id="title"
      name="title"
      bind:value={editedNote.title}
      required
    />

    <fieldset class="grid">
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

    <Tiptap
      class="focus-visible:outline focus-visible:outline-gray-500 p-4 md:min-h-80"
      bind:content={editedNote.content}
    />
  </fieldset>

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
