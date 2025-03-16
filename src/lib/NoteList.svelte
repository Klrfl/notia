<script lang="ts">
  import type { Note, NoteCategory } from "@/types/"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import { SvelteSet } from "svelte/reactivity"

  import Button from "./ui/Button.svelte"
  import Dialog from "./ui/Dialog.svelte"
  import NoteItem from "./NoteItem.svelte"
  import NoteEdit from "./NoteEdit.svelte"

  import { NoteService } from "@/shared/note.svelte"
  import { openDB } from "@/shared/db.svelte"

  import { Ellipsis, X } from "lucide-svelte"

  interface Props {
    notes: Note[]
    categories: NoteCategory[]
  }
  const { notes, categories }: Props = $props()

  let db: IDBDatabase | undefined = $state()
  let noteService: NoteService | undefined = $state()

  onMount(async () => {
    try {
      db = await openDB()
      noteService = new NoteService(db)

      await noteService.getAllNotes()
    } catch (error) {
      return console.error(error)
    }
  })

  let editedNote = $state<Note>()
  let isEditingNote = $state(false)

  const initiateEditNote = (note: Note) => {
    editedNote = note
    isEditingNote = true
  }

  const handleEditNote = async (editedNote: Note) => {
    try {
      await noteService?.editNote(editedNote)
    } catch (error) {
      console.error(error)
      alert("there was an error editing your note.")
    } finally {
      isEditingNote = false
    }
  }

  const handleDeleteNote = async (noteId: Note["id"]) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return
    }

    await noteService?.deleteNote(noteId)
  }

  const selectedNotes: Set<Note["id"]> = new SvelteSet()

  const handleSelectNote = (id: Note["id"]) => {
    if (!selectedNotes.has(id)) {
      selectedNotes.add(id)
    } else {
      selectedNotes.delete(id)
    }
  }
</script>

<section class="content p-8 flex flex-col gap-4">
  {#if !notes?.length}
    <p class="text-gray-700 text-center">No notes to display right now. 😴</p>
  {:else}
    {#if selectedNotes.size}
      <div
        class="flex justify-between items-center py-4 px-8 bg-white rounded-lg"
        transition:fly
      >
        <Button size="sm" variant="outline">
          <span class="sr-only">Cancel selection</span>
          <X size="1rem" color="red" />
        </Button>
        <p>
          selected {selectedNotes.size} note{selectedNotes.size !== 1
            ? "s"
            : ""}.
        </p>

        <button class="flex">
          <span class="sr-only">Actions</span>
          <Ellipsis />
        </button>
      </div>
    {/if}

    <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {#each notes as note (note.id)}
        <li
          class={[
            "flex flex-col gap-4 p-8 group relative",
            "bg-white has-[#note-item-select:checked]:outline-blue-400 outline outline-gray-200 rounded-lg",
          ]}
        >
          <!-- svelte doesn't allow inputs to be bound with bind:group -->
          <!-- if the bound variable and the input is on different components -->
          <!-- so I have to do this... sorry -->
          <!--- would be cool if svelte has something like Vue's defineModel -->

          <label for="note-item-select" class="sr-only">Select note</label>
          <input
            type="checkbox"
            name="note-item-select"
            id="note-item-select"
            class={[
              "absolute top-0 left-0 scale-150 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100 checked:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer",
            ]}
            value={note.id}
            bind:group={selectedNotes}
          />

          <NoteItem
            {note}
            editNote={initiateEditNote}
            deleteNote={handleDeleteNote}
          />
        </li>
      {/each}
    </ul>
  {/if}
</section>

<Dialog bind:isOpen={isEditingNote} heading="Edit note">
  {#if editedNote && categories}
    <NoteEdit bind:editedNote {categories} editNote={handleEditNote} />
  {/if}
</Dialog>

<style>
  .content {
    grid-column: content;
  }
</style>
