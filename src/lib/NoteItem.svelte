<script lang="ts">
  import type { Note } from "../types/"

  interface Props {
    note: Note
  }

  const { note }: Props = $props()
</script>

<li>
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
