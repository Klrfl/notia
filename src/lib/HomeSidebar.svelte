<script lang="ts">
  import { noteService } from "@/shared/note.svelte"
  import { categoryService } from "@/shared/category.svelte"

  import type { InsertableNote, NoteCategory } from "@/types"
  import Button from "./ui/Button.svelte"
  import Dialog from "./ui/Dialog.svelte"

  import Plus from "lucide-svelte/icons/plus"
  import Save from "lucide-svelte/icons/save"
  import Pencil from "lucide-svelte/icons/pencil"
  import Tag from "lucide-svelte/icons/tag"
  import Trash from "lucide-svelte/icons/trash"
  import Home from "lucide-svelte/icons/home"

  import NoteCategoryItem from "./NoteCategoryItem.svelte"
  import NoteForm from "./NoteForm.svelte"
  import Input from "./ui/Input.svelte"
  import { onMount } from "svelte"
  import { Link } from "svelte-routing"

  onMount(() => categoryService.getAllCategories())

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
    const id = noteService.selectedCategories.find((id) => id === targetId)
    if (!id) {
      return noteService.selectedCategories.push(targetId)
    }

    noteService.selectedCategories.splice(
      noteService.selectedCategories.indexOf(id),
      1
    )
  }
</script>

<menu
  class={[
    "sidebar absolute shadow-lg md:shadow-none md:relative flex flex-col gap-4 content-start px-8 py-4",
    "bg-white dark:bg-slate-800 border-r border-r-slate-200 dark:border-r-slate-700",
  ]}
>
  <Link to="/" let:active>
    <Button
      icon
      class={[
        "w-full justify-start",
        active
          ? "bg-sky-100 text-sky-900 outline outline-sky-600 dark:bg-sky-900/50 dark:text-sky-500"
          : "",
      ]}
      variant="none"
    >
      <Home />
      Home
    </Button>
  </Link>

  <Link to="/trash" let:active>
    <Button
      title="trashed notes"
      icon
      class={[
        "w-full justify-start",
        active
          ? "bg-sky-100 text-sky-900 outline outline-sky-600 dark:bg-sky-900/50 dark:text-sky-500"
          : "",
      ]}
      variant="none"
    >
      <Trash />
      Trash
    </Button>
  </Link>

  <hr class="border-gray-300 dark:border-gray-700" />

  <Button icon onclick={() => (isAddingNote = true)}>
    <Plus />
    Add new note
  </Button>

  <Dialog bind:isOpen={isAddingNote} heading="Add new note">
    <NoteForm
      noteAdded={handleAddNewNote}
      categories={categoryService.categories}
    />
  </Dialog>

  <menu class="flex flex-col">
    {#if categoryService.categories.length}
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

<style>
  .sidebar {
    grid-column: sidebar;
    z-index: 10;

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
