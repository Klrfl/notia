<script lang="ts">
  import Button from "../lib/ui/Button.svelte"
  import { Tag } from "lucide-svelte"

  const { number } = $props()
</script>

<li>
  <Button
    variant="none"
    icon
    onclick={() => alert("editing note...")}
    class="w-full bg-slate-100 hover:bg-slate-100 px-4 py-2 text-sm text-gray-700 flex gap-2"
  >
    <Tag />
    Category {number}
  </Button>
</li>
