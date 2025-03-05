<script lang="ts">
  import type { NoteCategory } from "../types/"
  import Button from "../lib/ui/Button.svelte"
  import { Tag, Trash } from "lucide-svelte"

  interface Props {
    category: NoteCategory
    categoryDeleted: (id: NoteCategory["id"]) => void
  }
  const { category, categoryDeleted }: Props = $props()
</script>

<li class="flex justify-between group outline-2 outline-gray-200">
  <Button
    variant="none"
    icon
    onclick={() => alert("editing category...")}
    class="w-full text-gray-700 flex gap-2 justify-start"
    size="sm"
  >
    <Tag />
    {category.name}
  </Button>

  <Button
    title="delete category"
    size="sm"
    variant="outline"
    onclick={() => categoryDeleted(category.id)}
    class="opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <Trash />
  </Button>
</li>
