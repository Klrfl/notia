<script lang="ts">
  import Plus from "lucide-svelte/icons/plus"
  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import type { InsertableNote, NoteCategory } from "../types/"

  import { marked } from "marked"
  import DOMPurify from "dompurify"

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
  class="grid grid-cols-6 gap-4 rounded-lg"
  onsubmit={() => {
    // you can't unwrap proxies natively
    // what is wrong with Svelte what the f
    noteAdded(JSON.parse(JSON.stringify(newNote)))

    newNote.title = ""
    newNote.content = ""
    newNote.categories = []
  }}
>
  <div class="flex flex-col gap-4 col-span-full md:col-span-2">
    <label for="title">title</label>
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
  </div>

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

  <Button icon size="sm" class="col-span-full md:col-span-2">
    <Plus />
    Add new note
  </Button>
</form>
