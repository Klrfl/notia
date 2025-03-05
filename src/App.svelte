<script lang="ts">
  import type { Note, InsertableNote, NoteCategory } from "./types/"
  import NoteItem from "./lib/NoteItem.svelte"
  import NoteForm from "./lib/NoteForm.svelte"
  import NoteEdit from "./lib/NoteEdit.svelte"
  import NoteCategoryItem from "./lib/NoteCategoryItem.svelte"
  import Dialog from "./lib/ui/Dialog.svelte"
  import Button from "./lib/ui/Button.svelte"
  import Input from "./lib/ui/Input.svelte"
  import { Plus, Tag } from "lucide-svelte"
  import { onMount } from "svelte"
  import { openDB } from "./shared/db.svelte"

  let title = "Notia"

  let db = $state<IDBDatabase>()
  let notes = $state<Note[]>([])
  let noteCategories = $state<NoteCategory[]>([])

  const initialize = (db: IDBDatabase) => {
    const notesTx = db.transaction("notes")
    const notesReq = notesTx.objectStore("notes").openCursor()

    notesReq.addEventListener("success", () => {
      const cursor = notesReq.result

      if (!cursor) return
      notes.push(cursor.value)
      cursor.continue()
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

  const handleEditNote = (note: Note) => {
    const notesStore = db
      ?.transaction("notes", "readwrite")
      .objectStore("notes")

    const newNote: Note = {
      ...note,
      updatedAt: new Date(),
    }

    const request = notesStore?.put(structuredClone(newNote))

    request?.addEventListener("success", () => {
      const noteLocation = notes.indexOf(note)
      notes.splice(noteLocation, 1, newNote)

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
  }
</script>

<main class="flex">
  <nav
    class="min-w-max bg-white outline outline-gray-200 min-h-screen px-8 py-4"
  >
    <header>
      <h1 class="text-4xl">{title}</h1>

      <Button icon onclick={() => (isAddingNote = true)}>
        <Plus />
        Add new note
      </Button>

      <Dialog bind:isOpen={isAddingNote} heading="Add new note">
        <NoteForm noteAdded={handleAddNewNote} />
      </Dialog>
    </header>

    <section class="flex flex-col-reverse">
      <ul class="grid gap-4">
        {#each noteCategories as category}
          <NoteCategoryItem {category} categoryDeleted={deleteCategory} />
        {/each}
      </ul>

      <Button icon variant="outline" onclick={() => (isAddingCategory = true)}>
        <Tag />
        Add new category
      </Button>

      <Dialog bind:isOpen={isAddingCategory} heading="Add new category">
        <form
          onsubmit={(e) => {
            e.preventDefault()
            addNewCategory(newCategory)
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
    </section>
  </nav>

  <section class="p-8">
    <ul class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {#if !notes.length}
        <li>No notes to display right now. 😴</li>
      {/if}

      {#each notes as note (note.id)}
        <NoteItem
          {note}
          editNote={initiateEditNote}
          deleteNote={handleDeleteNote}
        />
      {/each}
    </ul>
  </section>

  <Dialog bind:isOpen={isEditingNote} heading="Edit note">
    {#if editedNote}
      <NoteEdit bind:editedNote editNote={handleEditNote} />
    {/if}
  </Dialog>
</main>
