<script lang="ts">
  import DOMPurify from "dompurify"
  import HomeSidebar from "@/lib/HomeSidebar.svelte"
  import Button from "@/lib/ui/Button.svelte"
  import AlertDialog from "@/lib/ui/AlertDialog.svelte"
  import Checkbox from "@/lib/ui/Checkbox.svelte"

  import { noteService } from "@/shared/note.svelte"
  import type { Note } from "@/types"

  import RotateCcw from "lucide-svelte/icons/rotate-ccw"
  import X from "lucide-svelte/icons/x"
  import Trash from "lucide-svelte/icons/trash"

  import { onMount } from "svelte"
  import { flip } from "svelte/animate"
  import { fly, fade } from "svelte/transition"

  onMount(() => noteService.getAllNotes())

  let selectedNotes: Array<Note["id"]> = $state([])

  function selectNote(id: Note["id"]) {
    selectedNotes.push(id)
  }

  function unselectNote(id: Note["id"]) {
    return selectedNotes.splice(selectedNotes.indexOf(id), 1)
  }

  function handleRecoverNotes() {
    noteService.recoverNotes(selectedNotes)
    return (selectedNotes = [])
  }

  function handleDeleteNotes() {
    noteService.hardDeleteNotes(selectedNotes)
    return (selectedNotes = [])
  }
</script>

<main class="main-grid">
  <HomeSidebar />

  <section class="content p-8 flex flex-col gap-4">
    {#if !noteService.trashedNotes.length}
      <p class="text-center">No trashed notes yet.</p>
    {/if}

    {#if selectedNotes.length}
      <header
        class="bg-white py-4 px-8 rounded-lg dark:bg-slate-800 flex items-center justify-between gap-4"
        transition:fade
      >
        <Button
          icon
          size="sm"
          variant="none"
          class="outline outline-slate-200 dark:outline-slate-700"
          onclick={() => (selectedNotes = [])}
        >
          <X />
          Clear selection
        </Button>

        {selectedNotes.length} notes selected

        <AlertDialog
          title="Delete notes?"
          description="Are you sure you want to delete these notes? These notes will be deleted forever, and can't be recovered."
        >
          {#snippet trigger(props)}
            <Button {...props} icon variant="none">
              <Trash />
              Delete notes
            </Button>
          {/snippet}

          {#snippet action(props)}
            <Button
              {...props}
              icon
              variant="danger"
              onclick={handleDeleteNotes}
            >
              <Trash />
              Yes, delete notes
            </Button>
          {/snippet}

          {#snippet cancel()}
            No
          {/snippet}
        </AlertDialog>

        <AlertDialog
          title="Recover notes?"
          description="Are you sure you want to recover these notes?"
        >
          {#snippet trigger(props)}
            <Button {...props} icon>
              <RotateCcw />
              Recover selected notes
            </Button>
          {/snippet}

          {#snippet action(props)}
            <Button {...props} icon onclick={handleRecoverNotes}>
              <RotateCcw />
              Yes, recover selected notes
            </Button>
          {/snippet}

          {#snippet cancel()}
            No
          {/snippet}
        </AlertDialog>
      </header>
    {/if}

    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each noteService.trashedNotes as note (note.id)}
        <li
          class="rounded-lg bg-white outline outline-gray-200 dark:bg-slate-800 dark:outline-slate-700 has-[[data-state=checked]]:outline-blue-500 group relative"
          transition:fly
          animate:flip={{ duration: 500 }}
        >
          <label for={String(note.id)} class="block p-8 cursor-pointer">
            <Checkbox
              id={String(note.id)}
              onCheckedChange={(checked) =>
                checked ? selectNote(note.id) : unselectNote(note.id)}
              checked={selectedNotes.includes(note.id)}
            />

            <h2 class="text-xl">{note.title}</h2>

            <article class="preview select-none">
              {@html DOMPurify.sanitize(note.content)}
            </article>
          </label>
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
