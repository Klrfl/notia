<script lang="ts">
  import type { Note, NoteCategory } from "@/types/"
  import { fly } from "svelte/transition"

  import Button from "./ui/Button.svelte"
  import Dialog from "./ui/Dialog.svelte"
  import NoteItem from "./NoteItem.svelte"
  import NoteEdit from "./NoteEdit.svelte"
  import Checkbox from "@/lib/ui/Checkbox.svelte"
  import { Popover } from "bits-ui"

  import { noteService } from "@/shared/note.svelte"
  import { categoryService } from "@/shared/category.svelte"

  import Ellipsis from "lucide-svelte/icons/ellipsis"
  import X from "lucide-svelte/icons/x"
  import { onMount } from "svelte"
  import { flip } from "svelte/animate"
  import AlertDialog from "./ui/AlertDialog.svelte"

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
      class="flex justify-between items-center py-4 px-8 bg-white dark:bg-slate-800 rounded-lg"
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
            class="flex flex-col gap-4 bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg right-0"
            sideOffset={8}
          >
            <Button
              variant="primary"
              onclick={() => {
                isSelectingCategories = true
                isPopoverOpen = false
              }}
            >
              Add category
            </Button>

            <AlertDialog
              title="Are you sure?"
              description={`Are you sure you want to delete ${selectedNotes.length} note${selectedNotes.length > 1 ? "s" : ""}?`}
            >
              {#snippet trigger(props)}
                <Button {...props} variant="danger">Delete</Button>
              {/snippet}

              {#snippet action(props)}
                <Button
                  {...props}
                  variant="danger"
                  onclick={() => {
                    noteService.deleteNotes(selectedNotes)

                    selectedNotes = []
                    isPopoverOpen = false
                  }}
                >
                  Yes, Delete
                </Button>
              {/snippet}

              {#snippet cancel()}
                No
              {/snippet}
            </AlertDialog>
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

  {#if !noteService.filteredNotes.length}
    <p class="text-center">No notes to display right now. 😴</p>
  {:else}
    <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {#each noteService.filteredNotes as note (note.id)}
        <li
          class={[
            "group relative",
            "bg-white dark:bg-slate-800 outline outline-gray-200 dark:outline-slate-700 rounded-lg hover:outline-2 dark:hover:bg-slate-700",
            "has-[[data-state=checked]]:outline-blue-500 transition-colors",
          ]}
          transition:fly
          animate:flip={{ duration: 500 }}
        >
          <Checkbox
            id={String(note.id)}
            onCheckedChange={(checked) =>
              checked
                ? selectedNotes.push(note.id)
                : selectedNotes.splice(selectedNotes.indexOf(note.id), 1)}
            checked={selectedNotes.includes(note.id)}
          />

          <NoteItem
            {note}
            isSelectingNote={selectedNotes.length !== 0}
            selectNote={(id) =>
              !selectedNotes.includes(id)
                ? selectedNotes.push(note.id)
                : selectedNotes.splice(selectedNotes.indexOf(note.id), 1)}
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
