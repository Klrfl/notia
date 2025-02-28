<script lang="ts">
  import type { Note } from "../types/"
  import Button from "./ui/Button.svelte"
  import { Pencil, Trash } from "lucide-svelte"

  interface Props {
    note: Note
    editNote: (note: Note) => void
    deleteNote: (noteId: Note["id"]) => void
  }

  const { note, editNote, deleteNote }: Props = $props()
</script>

<li
  class="bg-white outline outline-gray-200 flex flex-col gap-4 p-8 rounded-lg"
>
  <h2 class="text-xl">{note.title}</h2>
  <p class="text-gray-700">{note.content}</p>

  <div class="flex justify-between text-sm text-gray-700">
    <p>
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.createdAt))}
    </p>

    <p>
      Last updated at {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.updatedAt))}
    </p>
  </div>

  <div class="flex gap-4 justify-end">
    <Button
      class="bg-blue-400 hover:bg-blue-500 text-white transition-colors"
      onclick={() => editNote(note)}
    >
      <Pencil size="1rem" class="text-gray-100" />
      Edit note
    </Button>

    <Button
      onclick={() => deleteNote(note.id)}
      class="outline outline-gray-300 hover:text-red-500 hover:outline-red-500 transition-colors"
    >
      <Trash size="1rem" />
      Delete note
    </Button>
  </div>
</li>
