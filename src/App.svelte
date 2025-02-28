<script lang="ts">
  import type { Note, InsertableNote } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import Button from "./lib/ui/Button.svelte"
  import CircleX from "lucide-svelte/icons/circle-x"

  let title = "Notia"

  const NOTES_LOCALSTORAGE_KEY = "notia-notes"
  const parsedNotes = JSON.parse(
    localStorage.getItem(NOTES_LOCALSTORAGE_KEY) ?? "[]"
  )
  const notes = $state<Note[]>(parsedNotes)

  const handleAddNewNote = (note: InsertableNote) => {
    notes.push({ ...note, createdAt: new Date(), updatedAt: new Date() })

    localStorage.setItem(NOTES_LOCALSTORAGE_KEY, JSON.stringify(notes))
  }

  let dialog = $state<HTMLDialogElement>()

  $effect(() => console.log(dialog))

  const editNote = () => {
    if (!dialog) return
    dialog.showModal()
  }

  const closeEditNote = () => {
    if (!dialog) return
    dialog.close()
  }
</script>

<main>
  <header class="max-w-7xl mx-auto px-8 py-4">
    <h1 class="text-4xl">{title}</h1>
  </header>

  <section
    class="grid gap-8 grid-cols-1 md:grid-cols-6 items-start max-w-7xl mx-auto px-8"
  >
    <NoteForm noteAdded={handleAddNewNote} />

    <ul class="flex flex-col gap-4 md:col-span-3 lg:col-span-4">
      {#each notes as note}
        {#if notes.length === 0}
          <li>No notes to display right now. 😴</li>
        {/if}
        <NoteItem {note} />
      {/each}
    </ul>

    <Button onclick={editNote} class="bg-white">Edit note</Button>
  </section>

  <dialog
    bind:this={dialog}
    class="m-auto w-full md:max-w-xl rounded-lg outline outline-gray-200"
  >
    <header class="p-4 flex justify-between items-center">
      <h2>Edit note</h2>

      <button
        onclick={closeEditNote}
        class="cursor-pointer"
        title="close this dialog"
      >
        <CircleX class="hover:text-gray-600" />
      </button>
    </header>

    <form method="dialog" class="flex flex-col p-4">
      <label for="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label for="content">content</label>
      <input type="text" id="content" name="content" required />

      <Button class="bg-blue-400 hover:bg-blue-500 text-white">
        Edit note
      </Button>
    </form>
  </dialog>
</main>
