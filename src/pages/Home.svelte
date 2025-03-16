<script lang="ts">
  import type { InsertableNote, NoteCategory } from "@/types/"
  import NoteForm from "@/lib/NoteForm.svelte"
  import NoteCategoryItem from "@/lib/NoteCategoryItem.svelte"

  import Dialog from "@/lib/ui/Dialog.svelte"
  import Button from "@/lib/ui/Button.svelte"
  import Input from "@/lib/ui/Input.svelte"

  import Pencil from "lucide-svelte/icons/pencil"
  import Plus from "lucide-svelte/icons/plus"
  import Save from "lucide-svelte/icons/save"
  import Tag from "lucide-svelte/icons/tag"

  import { onMount } from "svelte"
  import { NoteService } from "@/shared/note.svelte"
  import { CategoryService } from "@/shared/category.svelte"
  import { openDB } from "@/shared/db.svelte"
  import NoteList from "@/lib/NoteList.svelte"

  let db: IDBDatabase | undefined = $state()
  let noteService: NoteService | undefined = $state()
  let categoryService: CategoryService | undefined = $state()

  onMount(async () => {
    try {
      db = await openDB()
      noteService = new NoteService(db)
      categoryService = new CategoryService(db)

      await noteService.getAllNotes()
      await categoryService.getAllCategories()
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
  let isAddingCategory = $state(false)
  let newCategory = $state("")

  const addNewCategory = async (name: string) => {
    isAddingCategory = false

    await categoryService?.addCategory(name)
  }

  let isEditingCategories = $state(false)

  const editCategory = async (
    id: NoteCategory["id"],
    name: NoteCategory["name"]
  ) => {
    const newCategory = { id, name }
    await categoryService?.editCategory(newCategory)
  }

  const deleteCategory = async (categoryId: number) => {
    if (!window.confirm("are you sure?")) return
    await categoryService?.deleteCategory(categoryId)
    await noteService?.deleteNoteCategories(categoryId)
  }

  // TODO: move to NoteList.svelte
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
      {#if categoryService?.categories}
        {#each categoryService.categories as category (category.id)}
          <NoteCategoryItem
            {category}
            showEditButton={isEditingCategories}
            categoryEdited={editCategory}
            categoryDeleted={deleteCategory}
            toggleCategoryFilter={(id) => handleFilterByCategory(id)}
          />
        {/each}
      {/if}
    </menu>

    {#if isEditingCategories}
      <Button icon variant="outline" onclick={() => (isAddingCategory = true)}>
        <Tag />
        Add new category
      </Button>
    {/if}

    <Button
      icon
      variant="outline"
      onclick={() => (isEditingCategories = !isEditingCategories)}
    >
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

  {#if noteService?.notes && categoryService?.categories}
    <NoteList
      notes={noteService.notes}
      categories={categoryService.categories}
    />
  {/if}
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

  .sidebar {
    grid-column: sidebar;

    @media screen and (max-width: 768px) {
      translate: -100% 0;
      transition: translate 200ms ease;
      left: 0;
      right: 0;
    }
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
