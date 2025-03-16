<script lang="ts">
  import type { Note } from "../types/"
  import { fly } from "svelte/transition"
  import Button from "./ui/Button.svelte"

  import Pencil from "lucide-svelte/icons/pencil"
  import Trash from "lucide-svelte/icons/trash"

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
  transition:fly
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
    class="@container grid grid-cols-2 gap-2 sm:gap-4 lg:justify-end *:min-w-max mt-auto"
  >
    <p class="col-span-full justify-self-end text-sm text-gray-500">
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.createdAt))}
    </p>

    <Button
      icon
      onclick={() => editNote(note)}
      size="sm"
      variant="none"
      class="@max-2xs:col-span-full text-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
    >
      <Pencil size="1rem" />
      Edit note
    </Button>

    <Button
      icon
      variant="danger"
      onclick={() => deleteNote(note.id)}
      size="sm"
      class="@max-2xs:col-span-full"
    >
      <Trash size="1rem" />
      Delete note
    </Button>
  </div>
</li>
