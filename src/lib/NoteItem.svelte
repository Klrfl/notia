<script lang="ts">
  import type { Note } from "../types/"
  import Button from "./ui/Button.svelte"

  interface Props {
    note: Note
    editNote: (note: Note) => void
  }

  const { note, editNote }: Props = $props()
</script>

<li
  class="bg-white outline outline-gray-200 hover:bg-gray-200 flex flex-col gap-4 p-4 rounded-lg"
>
  <h2>{note.title}</h2>
  <p>{note.content}</p>

  <p>
    Created at {Intl.DateTimeFormat("en-US", {
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

  <Button
    class="bg-blue-400 hover:bg-blue-500 text-white"
    onclick={() => editNote(note)}>Edit note</Button
  >
</li>
