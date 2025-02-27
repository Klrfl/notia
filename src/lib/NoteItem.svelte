<script lang="ts">
  import type { Note } from "../types/"

  interface Props {
    note: Note
  }

  const { note }: Props = $props()
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
</li>
