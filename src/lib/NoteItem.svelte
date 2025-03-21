<script lang="ts">
  import type { Note } from "../types/"
  import Button from "./ui/Button.svelte"
  import Trash from "lucide-svelte/icons/trash"
  import DOMPurify from "dompurify"

  interface Props {
    note: Note
    isSelectingNote: boolean
    selectNote: (id: Note["id"]) => void
    editNote: (note: Note) => void
    deleteNote: (noteId: Note["id"]) => void
  }

  let { note, isSelectingNote, selectNote, editNote, deleteNote }: Props =
    $props()
</script>

<button
  class="size-full text-left grid gap-4 p-8 cursor-pointer"
  onclick={() => (!isSelectingNote ? editNote(note) : selectNote(note.id))}
>
  <h2 class="text-xl">{note.title}</h2>
  <article class="line-clamp-3 preview select-none">
    {@html DOMPurify.sanitize(note.content)}
  </article>

  <div
    class="@container grid gap-2 sm:gap-4 lg:justify-end *:min-w-max mt-auto"
  >
    <p
      class="col-span-full justify-self-end text-sm text-gray-500 dark:text-gray-300"
    >
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.createdAt))}
    </p>

    <Button
      icon
      variant="danger"
      onclick={() => deleteNote(note.id)}
      size="sm"
      class="col-span-full"
    >
      <Trash size="1rem" />
      Delete note
    </Button>
  </div>
</button>
