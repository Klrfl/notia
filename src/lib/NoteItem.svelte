<script lang="ts">
  import type { Note } from "../types/"
  import { fade } from "svelte/transition"
  import Button from "./ui/Button.svelte"

  import { Pencil, Trash } from "lucide-svelte"

  import { marked } from "marked"
  import DOMPurify from "dompurify"

  interface Props {
    note: Note
    editNote: (note: Note) => void
    deleteNote: (noteId: Note["id"]) => void
  }

  const { note, editNote, deleteNote }: Props = $props()
</script>

<li
  class="bg-white outline outline-gray-200 flex flex-col gap-4 p-8 rounded-lg"
  transition:fade
>
  <h2 class="text-xl">{note.title}</h2>

  <article class="text-gray-700 line-clamp-3 preview">
    {#await marked.parse(note.content.trim())}
      tunggu sebentar
    {:then parsed}
      {@html DOMPurify.sanitize(parsed)}
    {:catch}
      Something went wrong
    {/await}
  </article>

  <div
    class="grid grid-cols-2 gap-4 flex-wrap lg:justify-end lg:*:flex-[0] *:flex-1 *:min-w-max mt-auto"
  >
    <p class="col-span-2 justify-self-end text-sm text-gray-500">
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.createdAt))}
    </p>
    <Button icon onclick={() => editNote(note)}>
      <Pencil size="1rem" class="text-gray-100" />
      Edit note
    </Button>

    <Button icon variant="danger" onclick={() => deleteNote(note.id)}>
      <Trash size="1rem" />
      Delete note
    </Button>
  </div>
</li>
