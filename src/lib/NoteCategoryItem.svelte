<script lang="ts">
  import type { NoteCategory } from "../types/"
  import Button from "../lib/ui/Button.svelte"
  import Input from "../lib/ui/Input.svelte"
  import Dialog from "./ui/Dialog.svelte"

  import Pencil from "lucide-svelte/icons/pencil"
  import Plus from "lucide-svelte/icons/plus"
  import Tag from "lucide-svelte/icons/tag"
  import Trash from "lucide-svelte/icons/trash"

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

  function handleClick() {
    if (showEditButton) {
      return (isEditing = true)
    }

    isCategoryInFilter = !isCategoryInFilter
    return toggleCategoryFilter(category.id)
  }
</script>

<li
  class="hover:bg-gray-200/70 dark:hover:bg-slate-900/50 group md:max-w-[25ch] relative"
>
  <Button
    variant="none"
    icon
    onclick={handleClick}
    class={[
      "w-full justify-start",
      isCategoryInFilter ? "border-r-2 border-r-blue-500 text-white" : "",
    ]}
    size="sm"
  >
    {#if showEditButton}
      <Pencil />
    {:else}
      <Tag />
    {/if}

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
        Edit category
      </Button>
    </form>
  </Dialog>

  {#if showEditButton}
    <Button
      title="delete category"
      size="sm"
      variant="outline"
      onclick={() => categoryDeleted(category.id)}
      class="absolute right-0 top-0 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity bg-gray-200 dark:bg-slate-800"
    >
      <Trash />
    </Button>
  {/if}
</li>
