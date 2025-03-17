<script lang="ts">
  import type { Note, NoteCategory } from "@/types/"
  import { fly } from "svelte/transition"

  import Button from "./ui/Button.svelte"
  import Dialog from "./ui/Dialog.svelte"
  import NoteItem from "./NoteItem.svelte"
  import NoteEdit from "./NoteEdit.svelte"

  import { noteService } from "@/shared/note.svelte"
  import { categoryService } from "@/shared/category.svelte"

  import { Ellipsis, X } from "lucide-svelte"
  import { Popover } from "bits-ui"
  import { onMount } from "svelte"

  onMount(() => {
    noteService.getAllNotes()
    categoryService.getAllCategories()
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

  let selectedNotes: Array<Note["id"]> = $state([])

  let selectedCategories: Array<NoteCategory["id"]> = $state([])
  let isSelectingCategories = $state(false)
  let isPopoverOpen = $state(false)

  const handleCategorizeNotes = async () => {
    await noteService?.categorizeNotes(selectedNotes, selectedCategories)

    isSelectingCategories = false
    selectedNotes = []
  }
</script>

<section class="content p-8 flex flex-col gap-4">
  {#if selectedNotes.length}
    <header
      class="flex justify-between items-center py-4 px-8 bg-white rounded-lg"
      transition:fly
    >
      <Button size="sm" variant="outline" onclick={() => (selectedNotes = [])}>
        <span class="sr-only">Cancel selection</span>
        <X size="1rem" color="red" />
      </Button>
      <p>
        selected {selectedNotes.length} note{selectedNotes.length !== 1
          ? "s"
          : ""}.
      </p>

      <Popover.Root bind:open={isPopoverOpen}>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              class="flex hover:bg-gray-200/50"
              variant="none"
              size="sm"
              onclick={() => (isPopoverOpen = true)}
            >
              <span class="sr-only">Actions</span>
              <Ellipsis />
            </Button>
          {/snippet}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            class="flex flex-col gap-4 bg-white/80 p-4 rounded-lg shadow-lg right-0"
            sideOffset={8}
          >
            <Button
              variant="primary"
              size="sm"
              onclick={() => {
                isSelectingCategories = true
                isPopoverOpen = false
              }}
            >
              Add category
            </Button>
            <Button
              variant="danger"
              size="sm"
              onclick={() => {
                if (!confirm("are you sure?")) return
                noteService.deleteNotes(selectedNotes)
              }}
            >
              Delete
            </Button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Dialog
        bind:isOpen={isSelectingCategories}
        heading="Select categories to add"
      >
        <form
          onsubmit={(e) => {
            e.preventDefault()
            handleCategorizeNotes()
          }}
          class="grid gap-4"
        >
          {#each categoryService.categories as category (category.id)}
            <label
              for={`${category.id}-${category.name}`}
              class="flex gap-4 cursor-pointer"
            >
              {category.name}
              <input
                type="checkbox"
                name="category"
                id={`${category.id}-${category.name}`}
                class="order-first"
                value={category.id}
                bind:group={selectedCategories}
              />
            </label>
          {/each}

          <Button onclick={() => handleCategorizeNotes} size="sm">
            Add categories
          </Button>
        </form>
      </Dialog>
    </header>
  {/if}

  {#if !noteService.notes.length}
    <p class="text-gray-700 text-center">No notes to display right now. 😴</p>
  {:else}
    <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {#each noteService.filteredNotes as note (note.id)}
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
  {#if editedNote}
    <NoteEdit
      bind:editedNote
      categories={categoryService.categories}
      editNote={handleEditNote}
    />
  {/if}
</Dialog>

<style>
  .content {
    grid-column: content;
  }
</style>
