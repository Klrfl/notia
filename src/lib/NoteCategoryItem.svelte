<script lang="ts">
  import type { NoteCategory } from "../types/"
  import Button from "../lib/ui/Button.svelte"
  import Input from "../lib/ui/Input.svelte"
  import { Pencil, Plus, Tag, Trash } from "lucide-svelte"
  import Dialog from "./ui/Dialog.svelte"

  interface Props {
    category: NoteCategory
    categoryEdited: (
      id: NoteCategory["id"],
      newName: NoteCategory["name"]
    ) => void
    categoryDeleted: (id: NoteCategory["id"]) => void
  }

  const { category, categoryEdited, categoryDeleted }: Props = $props()

  let newCategory = $state(category.name)
  let isEditing = $state(false)
</script>

<li class="hover:bg-gray-200/70 flex justify-between group">
  <Button
    variant="none"
    icon
    onclick={() => (isEditing = true)}
    class="w-full text-gray-700 flex gap-2 justify-start"
    size="sm"
  >
    <div>
      <Pencil class="hidden group-hover:block" />
      <Tag class="block group-hover:hidden" />
    </div>

    {category.name}
  </Button>

  <Dialog bind:isOpen={isEditing} heading="Edit category name">
    <form
      method="dialog"
      onsubmit={() => categoryEdited(category.id, newCategory)}
      class="grid gap-4"
    >
      <label for="category">category</label>
      <Input
        autofocus
        type="text"
        id="category"
        name="category"
        bind:value={newCategory}
        required
      />

      <Button icon>
        <Plus />
        Add new button
      </Button>
    </form>
  </Dialog>

  <Button
    title="delete category"
    size="sm"
    variant="outline"
    onclick={() => categoryDeleted(category.id)}
    class="opacity-0 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity"
  >
    <Trash />
  </Button>
</li>
