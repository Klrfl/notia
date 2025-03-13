<script lang="ts">
  import type { Note, InsertableNote, NoteCategory } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import NoteEdit from "./lib/NoteEdit.svelte"
  import NoteCategoryItem from "./lib/NoteCategoryItem.svelte"

  import Dialog from "./lib/ui/Dialog.svelte"
  import Button from "./lib/ui/Button.svelte"
  import Input from "./lib/ui/Input.svelte"

  import Info from "lucide-svelte/icons/info"
  import Menu from "lucide-svelte/icons/menu"
  import Pencil from "lucide-svelte/icons/pencil"
  import Plus from "lucide-svelte/icons/plus"
  import Save from "lucide-svelte/icons/save"
  import Tag from "lucide-svelte/icons/tag"
  import X from "lucide-svelte/icons/x"

  import { onMount } from "svelte"
  import { openDB } from "./shared/db.svelte"

  let title = "Notia"

  let db = $state<IDBDatabase>()
  let notes = $state<Note[]>([])

  let selectedCategories: number[] = $state([])
  let filteredNotes = $derived(
    !selectedCategories.length
      ? notes
      : notes.filter((note) => {
          return (
            note.categories &&
            note.categories?.some((category) =>
              selectedCategories.includes(category)
            )
          )
        })
  )

  let noteCategories = $state<NoteCategory[]>([])

  const initialize = (db: IDBDatabase) => {
    const notesTx = db.transaction("notes")
    const notesReq = notesTx.objectStore("notes").getAll()

    notesReq.addEventListener("success", () => {
      notes = notesReq.result
    })

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
  }

  onMount(async () => {
    try {
      db = await openDB()
      initialize(db)
    } catch (error) {
      return console.error(error)
    }
  })

  let isAddingNote = $state(false)

  const handleAddNewNote = (note: InsertableNote) => {
    isAddingNote = false
    const notesStore = db
      ?.transaction("notes", "readwrite")
      .objectStore("notes")

    const newNote = {
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const newNoteReq = notesStore?.add(structuredClone(newNote))

    newNoteReq?.addEventListener("success", () => {
      const returnNewNote = notesStore?.get(newNoteReq.result)

      returnNewNote?.addEventListener("success", () =>
        notes.push(returnNewNote.result)
      )
    })

    newNoteReq?.addEventListener("error", () => {
      alert("there was an error adding a new note.")
      console.error(newNoteReq.error)
    })
  }

  let editedNote = $state<Note>()
  let isEditingNote = $state(false)

  const initiateEditNote = (note: Note) => {
    editedNote = note
    isEditingNote = true
  }

  const handleEditNote = (editedNote: Note) => {
    const notesStore = db
      ?.transaction("notes", "readwrite")
      .objectStore("notes")

    const newNote: Note = {
      ...editedNote,
      updatedAt: new Date(),
    }

    const request = notesStore?.put(structuredClone(newNote))

    request?.addEventListener("success", () => {
      const noteLocation = notes.find(({ id }) => id === editedNote.id)
      if (!noteLocation) return alert("can't edit your note for some reason.")

      notes.splice(notes.indexOf(noteLocation), 1, newNote)

      isEditingNote = false
    })
  }

  const handleDeleteNote = (noteId: Note["id"]) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return
    }

    const notesStore = db?.transaction("notes", "readwrite")
    const notesObjectStore = notesStore?.objectStore("notes")
    notesObjectStore?.delete(noteId)

    notes = notes.filter((note) => note.id !== noteId)
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

  let isEditingCategory = $state(false)

  const toggleEditCategory = () => {
    isEditingCategory = !isEditingCategory
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

  let isAboutOpen = $state(false)
</script>

<main class="main-grid min-h-screen">
  <header
    class="header col-span-full flex gap-4 items-center px-8 py-4 bg-white border-b-2 border-b-gray-200"
  >
    <h1 class="text-4xl text-slate-700">{title}</h1>

    <div class="order-first">
      <input
        type="checkbox"
        name="sidebar-toggle"
        id="sidebar-toggle"
        class="peer hidden"
      />

      <label
        for="sidebar-toggle"
        class="sidebar-toggle block peer-checked:hidden"
      >
        <Menu />
        <div class="sr-only">Open sidebar</div>
      </label>

      <label
        for="sidebar-toggle"
        class="sidebar-toggle hidden peer-checked:block"
      >
        <X />
        <div class="sr-only">Close sidebar</div>
      </label>
    </div>
  </header>

  <menu
    class="sidebar absolute shadow-lg md:shadow-none md:relative flex flex-col gap-4 content-start bg-white border-r-2 border-r-gray-200 px-8 py-4"
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
          showEditButton={isEditingCategory}
          categoryEdited={editCategory}
          categoryDeleted={deleteCategory}
          toggleCategoryFilter={(id) => handleFilterByCategory(id)}
        />
      {/each}
    </menu>

    <Button icon variant="outline" onclick={() => (isAddingCategory = true)}>
      <Tag />
      Add new category
    </Button>

    <Button icon variant="outline" onclick={() => toggleEditCategory()}>
      {#if !isEditingCategory}
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

    <Button
      variant="outline"
      size="sm"
      class="mt-auto text-gray-700"
      icon
      onclick={() => (isAboutOpen = true)}
    >
      <Info />
      About Notia
    </Button>

    <Dialog bind:isOpen={isAboutOpen} heading="About notia">
      <article class="preview">
        <p>
          Notia is a really light markdown-based notetaking app I made to learn
          Svelte. It was an interesting experience to learn this framework!
        </p>

        <p>
          This application stores all of its data locally in your browser, so
          your notes never leave your device.
        </p>

        <p>If you enjoyed this app, please give it a star in Github. ⭐</p>
        <a
          href="https://github.com/klrfl/notia"
          target="_blank"
          class="text-blue-500 hover:text-blue-700 hover:underline">Notia</a
        >
      </article>
    </Dialog>
  </menu>

  <section class="content p-8">
    {#if !filteredNotes.length}
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
  @reference "./app.css";

  .main-grid {
    display: grid;
    grid-auto-rows: max-content auto;
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
      translate: -100% 9ch;
      transition: translate 200ms ease;
      left: 0;
      right: 0;
    }
  }

  .content {
    grid-column: content;
  }

  .sidebar-toggle {
    @apply md:hidden p-4 cursor-pointer hover:bg-gray-200;
  }

  .main-grid:has(#sidebar-toggle:checked) .sidebar {
    translate: 0 9ch;

    @media screen and (min-width: 768px) {
      translate: 0;
    }
  }

  /* disable scroll when menu is open */
  :global(body .main-grid:has(#sidebar-toggle:checked)) {
    @media screen and (max-width: 768px) {
      max-height: 100vh;
      overflow: hidden;
    }
  }
</style>
