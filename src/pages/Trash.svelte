<script lang="ts">
  import DOMPurify from "dompurify"
  import HomeSidebar from "@/lib/HomeSidebar.svelte"
  import Button from "@/lib/ui/Button.svelte"
  import AlertDialog from "@/lib/ui/AlertDialog.svelte"
  import { Checkbox } from "bits-ui"

  import { noteService } from "@/shared/note.svelte"
  import type { Note } from "@/types"

  import Check from "lucide-svelte/icons/check"
  import RotateCcw from "lucide-svelte/icons/rotate-ccw"
  import X from "lucide-svelte/icons/x"

  import { onMount } from "svelte"
  import { flip } from "svelte/animate"
  import { fade } from "svelte/transition"

  onMount(() => noteService.getAllNotes())

  let selectedNotes: Array<Note["id"]> = $state([])

  function handleRecoverNote(noteId: Note["id"]) {
    noteService.recoverNote(noteId)
  }

  function handleRecoverNotes() {
    if (
      !confirm(
        `are you sure you want to recover ${selectedNotes.length} notes?`
      )
    ) {
      return
    }

    selectedNotes = []
    return noteService.recoverNotes(selectedNotes)
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

        <Button icon size="sm" onclick={() => handleRecoverNotes()}>
          <RotateCcw />
          Recover selected Notes
        </Button>
      </header>
    {/if}

    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each noteService.trashedNotes as note (note.id)}
        <li
          class="rounded-lg bg-white outline outline-gray-200 dark:bg-slate-800 dark:outline-slate-700 has-[[data-state=checked]]:outline-blue-500 group relative"
          animate:flip={{ duration: 500 }}
        >
          <label for={String(note.id)} class="block p-8 cursor-pointer">
            <Checkbox.Root
              id={String(note.id)}
              class={[
                "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2",
                "outline outline-gray-200 dark:outline-slate-700",
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer",
                "aspect-square size-12 bg-white dark:bg-slate-800 p-4 rounded-lg",
                "data-[state=checked]:dark:bg-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:opacity-100",
                "text-white",
              ]}
              onCheckedChange={(checked) =>
                checked
                  ? selectedNotes.push(note.id)
                  : selectedNotes.splice(selectedNotes.indexOf(note.id), 1)}
              checked={selectedNotes.includes(note.id)}
            >
              {#snippet children({ checked })}
                {#if checked}
                  <Check size="1.2rem" />
                {/if}
              {/snippet}
            </Checkbox.Root>

            <h2 class="text-xl">{note.title}</h2>

            <article class="preview select-none">
              {@html DOMPurify.sanitize(note.content)}
            </article>

            <AlertDialog
              title="Are you sure?"
              description="Are you sure you would like to recover this note?"
            >
              {#snippet trigger(props)}
                <Button {...props} icon variant="outline" class="mt-8">
                  <RotateCcw size="1rem" />
                  Recover note
                </Button>
              {/snippet}

              {#snippet action()}
                <Button onclick={() => handleRecoverNote(note.id)}>
                  Recover note
                </Button>
              {/snippet}

              {#snippet cancel()}
                No
              {/snippet}
            </AlertDialog>
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
