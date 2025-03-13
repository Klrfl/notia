<script lang="ts">
  import type { Note, InsertableNote, NoteCategory } from "@/types/"
  import NoteItem from "@/lib/NoteItem.svelte"
  import NoteForm from "@/lib/NoteForm.svelte"
  import NoteEdit from "@/lib/NoteEdit.svelte"
  import NoteCategoryItem from "@/lib/NoteCategoryItem.svelte"

  import Dialog from "@/lib/ui/Dialog.svelte"
  import Button from "@/lib/ui/Button.svelte"
  import Input from "@/lib/ui/Input.svelte"

  import Pencil from "lucide-svelte/icons/pencil"
  import Plus from "lucide-svelte/icons/plus"
  import Save from "lucide-svelte/icons/save"
  import Tag from "lucide-svelte/icons/tag"

  import { NoteService } from "@/shared/note.svelte"
  import { onMount } from "svelte"
  import { openDB } from "@/shared/db.svelte"

  let db: IDBDatabase | undefined = $state()
  let noteService: NoteService | undefined = $state()

  onMount(async () => {
    try {
      db = await openDB()
      noteService = new NoteService(db)
      await noteService.getAllNotes()

      const categoriesTx = db.transaction("categories")
      const noteCategoriesReq = categoriesTx
        .objectStore("categories")
        .openCursor()

      noteCategoriesReq.addEventListener("success", () => {
        const cursor = noteCategoriesReq.result

        if (!cursor) return
        noteCategories.push(cursor.value)
        cursor.continue()
      })
    } catch (error) {
      return console.error(error)
    }
  })

  let selectedCategories: number[] = $state([])
  let filteredNotes = $derived(
    !selectedCategories.length
      ? noteService?.notes
      : noteService?.notes.filter((note) => {
          return (
            note.categories &&
            note.categories?.some((category) =>
              selectedCategories.includes(category)
            )
          )
        })
  )

  let noteCategories = $state<NoteCategory[]>([])

  let isAddingNote = $state(false)

  const handleAddNewNote = async (note: InsertableNote) => {
    isAddingNote = false

    try {
      await noteService?.addNewNote(note)
    } catch (error) {
      console.error(error)
      alert("there was an error adding a new note.")
    }
  }

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

  let isAddingCategory = $state(false)
  let newCategory = $state("")

  const addNewCategory = (name: string) => {
    isAddingCategory = false

    const categoryStore = db
      ?.transaction("categories", "readwrite")
      .objectStore("categories")

    const req = categoryStore?.add({ name })

    req?.addEventListener("success", () => {
      const returnReq = categoryStore?.get(req.result)

      returnReq?.addEventListener("success", () => {
        noteCategories.push(returnReq.result)
      })
    })
  }

  let isEditingCategories = $state(false)

  const toggleEditCategories = () => {
    isEditingCategories = !isEditingCategories
  }

  const editCategory = (id: NoteCategory["id"], name: NoteCategory["name"]) => {
    const newCategory = { id, name }

    const tx = db?.transaction("categories", "readwrite")
    const req = tx?.objectStore("categories").put(newCategory)

    req?.addEventListener("success", () => {
      noteCategories.splice(noteCategories.indexOf(newCategory), 1, newCategory)
      console.log("successfully edited category")
    })
  }

  const deleteCategory = (categoryId: number) => {
    if (!window.confirm("are you sure?")) return

    const categoryStore = db
      ?.transaction("categories", "readwrite")
      .objectStore("categories")
    const req = categoryStore?.delete(categoryId)

    req?.addEventListener("success", () => {
      console.log("successfully deleted category.")
    })

    noteCategories = noteCategories.filter(({ id }) => id !== categoryId)

    // delete target category id on notes
    const notesTx = db?.transaction("notes", "readwrite")
    const cursorReq = notesTx?.objectStore("notes")?.openCursor()

    cursorReq?.addEventListener("success", () => {
      const cursor = cursorReq.result
      if (!cursor) return

      const newNote = cursor.value as Note
      newNote.categories = newNote.categories?.filter((c) => c !== categoryId)
      notesTx?.objectStore("notes").put(newNote)

      cursor.continue()
    })
  }

  const handleFilterByCategory = (targetId: number) => {
    const id = selectedCategories.find((id) => id === targetId)
    if (!id) {
      return selectedCategories.push(targetId)
    }

    selectedCategories.splice(selectedCategories.indexOf(id), 1)
  }
</script>

<main class="main-grid">
  <menu
    class="sidebar absolute shadow-lg md:shadow-none md:relative flex flex-col gap-4 content-start bg-white border-r border-r-gray-200 px-8 py-4"
  >
    <Button icon onclick={() => (isAddingNote = true)}>
      <Plus />
      Add new note
    </Button>

    <Dialog bind:isOpen={isAddingNote} heading="Add new note">
      <NoteForm noteAdded={handleAddNewNote} />
    </Dialog>

    <menu class="flex flex-col">
      {#each noteCategories as category (category.id)}
        <NoteCategoryItem
          {category}
          showEditButton={isEditingCategories}
          categoryEdited={editCategory}
          categoryDeleted={deleteCategory}
          toggleCategoryFilter={(id) => handleFilterByCategory(id)}
        />
      {/each}
    </menu>

    {#if isEditingCategories}
      <Button icon variant="outline" onclick={() => (isAddingCategory = true)}>
        <Tag />
        Add new category
      </Button>
    {/if}

    <Button icon variant="outline" onclick={() => toggleEditCategories()}>
      {#if !isEditingCategories}
        <Pencil />
        Edit categories
      {:else}
        <Save />
        Save categories
      {/if}
    </Button>

    <Dialog bind:isOpen={isAddingCategory} heading="Add new category">
      <form
        onsubmit={(e) => {
          e.preventDefault()
          addNewCategory(newCategory)
          newCategory = ""
        }}
        class="grid gap-4"
      >
        <label for="category">category</label>
        <Input
          autofocus
          bind:value={newCategory}
          type="text"
          name="category"
          id="category"
          placeholder="Category name"
          required
        />
        <Button type="submit">Submit</Button>
      </form>
    </Dialog>
  </menu>

  <section class="content p-8">
    {#if !filteredNotes?.length}
      <p class="text-gray-700 text-center">No notes to display right now. 😴</p>
    {:else}
      <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {#each filteredNotes as note (note.id)}
          <NoteItem
            {note}
            editNote={initiateEditNote}
            deleteNote={handleDeleteNote}
          />
        {/each}
      </ul>
    {/if}
  </section>

  <Dialog bind:isOpen={isEditingNote} heading="Edit note">
    {#if editedNote}
      <NoteEdit
        bind:editedNote
        categories={noteCategories}
        editNote={handleEditNote}
      />
    {/if}
  </Dialog>
</main>

<style>
  @reference "@/app.css";

  .main-grid {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns:
      [sidebar-start]
      max-content
      [sidebar-end content-start]
      repeat(10, 1fr)
      [content-end];
  }

  .header {
    grid-column: 1/-1;
  }

  .sidebar {
    grid-column: sidebar;

    @media screen and (max-width: 768px) {
      translate: -100% 0;
      transition: translate 200ms ease;
      left: 0;
      right: 0;
    }
  }

  .content {
    grid-column: content;
  }

  :global(body:has(#sidebar-toggle:checked) .sidebar) {
    translate: 0;

    @media screen and (min-width: 768px) {
      translate: 0;
    }
  }

  /* disable scroll when menu is open */
  :global(body:has(#sidebar-toggle:checked)) {
    @media screen and (max-width: 768px) {
      max-height: 100vh;
      overflow: hidden;
    }
  }
</style>
