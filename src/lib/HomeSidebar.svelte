<script lang="ts">
  import { openDB } from "@/shared/db.svelte"
  import { NoteService } from "@/shared/note.svelte"
  import { CategoryService } from "@/shared/category.svelte"

  import { onMount } from "svelte"
  import type { InsertableNote, NoteCategory } from "@/types"
  import Button from "./ui/Button.svelte"
  import Dialog from "./ui/Dialog.svelte"

  import Plus from "lucide-svelte/icons/plus"
  import Save from "lucide-svelte/icons/save"
  import Pencil from "lucide-svelte/icons/pencil"
  import Tag from "lucide-svelte/icons/tag"

  import NoteCategoryItem from "./NoteCategoryItem.svelte"
  import NoteForm from "./NoteForm.svelte"
  import Input from "./ui/Input.svelte"

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

  const handleAddNewNote = async (note: InsertableNote) => {
    isAddingNote = false

    try {
      await noteService?.addNewNote(note)
    } catch (error) {
      console.error(error)
      alert("there was an error adding a new note.")
    }
  }

  let isAddingNote = $state(false)

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

  // TODO: somehow share state with NoteList.svelte
  const handleFilterByCategory = (targetId: number) => {
    const id = selectedCategories.find((id) => id === targetId)
    if (!id) {
      return selectedCategories.push(targetId)
    }

    selectedCategories.splice(selectedCategories.indexOf(id), 1)
  }
</script>

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
