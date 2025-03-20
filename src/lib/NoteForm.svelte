<script lang="ts">
  import type { InsertableNote, NoteCategory } from "../types/"
  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import Tiptap from "./ui/Tiptap.svelte"

  import Plus from "lucide-svelte/icons/plus"

  interface Props {
    noteAdded: (note: InsertableNote) => void
    categories: NoteCategory[]
  }

  const { noteAdded, categories }: Props = $props()

  const newNote = $state<InsertableNote>({
    title: "",
    content: "",
    categories: [],
  })
</script>

<form
  method="dialog"
  class="grid gap-4 rounded-lg"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    noteAdded(JSON.parse(JSON.stringify(newNote)))

    newNote.title = ""
    newNote.content = ""
    newNote.categories = []
  }}
>
  <label for="title" class="sr-only">title</label>
  <Input
    type="text"
    id="title"
    name="title"
    placeholder="title"
    required
    bind:value={newNote.title}
  />

  <fieldset class="grid grid-cols-subgrid">
    <legend>categories</legend>

    {#if categories.length}
      <div class="flex flex-wrap gap-2">
        {#each categories as category (category.id)}
          <label
            for={String(category.id)}
            class="px-3 py-1 cursor-pointer outline-2 outline-gray-200 has-focus-visible:outline-blue-500 has-checked:bg-blue-400 has-checked:outline-blue-500 has-checked:text-white select-none rounded-full"
          >
            {category.name}

            <input
              type="checkbox"
              class="sr-only"
              id={String(category.id)}
              value={category.id}
              bind:group={newNote.categories}
            />
          </label>
        {/each}
      </div>
    {/if}
  </fieldset>

  <label for="content" class="sr-only">content</label>

  <Tiptap bind:content={newNote.content} />

  <Button icon size="sm">
    <Plus />
    Add new note
  </Button>
</form>
