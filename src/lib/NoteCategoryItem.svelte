<script lang="ts">
  import type { NoteCategory } from "../types/"
  import Button from "../lib/ui/Button.svelte"
  import Input from "../lib/ui/Input.svelte"
  import { Pencil, Plus, Tag, Trash } from "lucide-svelte"
  import Dialog from "./ui/Dialog.svelte"

  interface Props {
    showEditButton: boolean
    category: NoteCategory
    categoryEdited: (
      id: NoteCategory["id"],
      newName: NoteCategory["name"]
    ) => void
    categoryDeleted: (id: NoteCategory["id"]) => void
    toggleCategoryFilter: (id: NoteCategory["id"]) => void
  }

  const {
    category,
    showEditButton,
    categoryEdited,
    categoryDeleted,
    toggleCategoryFilter,
  }: Props = $props()

  let newCategory = $state(category.name)
  let isCategoryInFilter = $state(false)
  let isEditing = $state(false)
</script>

<li
  class="hover:bg-gray-200/70 flex justify-between group max-w-[25ch] text-left"
>
  <Button
    variant="none"
    icon
    onclick={() => {
      if (showEditButton) {
        return (isEditing = true)
      }

      isCategoryInFilter = !isCategoryInFilter
      return toggleCategoryFilter(category.id)
    }}
    class={[
      "w-full flex gap-2 justify-start",
      isCategoryInFilter ? "bg-blue-500 text-white" : "text-gray-700",
    ]}
    size="sm"
  >
    <div>
      {#if showEditButton}
        <Pencil />
      {:else}
        <Tag />
      {/if}
    </div>

    <span class="whitespace-nowrap overflow-hidden overflow-ellipsis">
      {category.name}
    </span>
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

  {#if showEditButton}
    <Button
      title="delete category"
      size="sm"
      variant="outline"
      onclick={() => categoryDeleted(category.id)}
      class="opacity-0 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity"
    >
      <Trash />
    </Button>
  {/if}
</li>
