<script lang="ts">
  import HomeSidebar from "@/lib/HomeSidebar.svelte"
  import DOMPurify from "dompurify"

  import { noteService } from "@/shared/note.svelte"
  import { onMount } from "svelte"
  import Button from "@/lib/ui/Button.svelte"
  import type { Note } from "@/types"

  onMount(() => noteService.getAllNotes())

  function handleRecoverNote(noteId: Note["id"]) {
    noteService.recoverNote(noteId)
  }
</script>

<main class="main-grid">
  <HomeSidebar />

  <section class="content p-8">
    {#if !noteService.trashedNotes.length}
      <p class="text-center">No trashed notes yet.</p>
    {/if}

    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each noteService.trashedNotes as note (note.id)}
        <li class="p-8 rounded-lg dark:bg-slate-800">
          <h2 class="text-xl">{note.title}</h2>

          <article class="preview select-none">
            {@html DOMPurify.sanitize(note.content)}
          </article>

          <Button
            variant="outline"
            class="mt-8"
            onclick={() => handleRecoverNote(note.id)}>Recover note</Button
          >
        </li>
      {/each}
    </ul>
  </section>
</main>

<style>
  .main-grid {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns:
      [sidebar-start]
      max-content
      [sidebar-end content-start]
      repeat(10, 1fr)
      [content-end];
    flex-grow: 1;
  }

  .content {
    grid-column: content;
  }
</style>
