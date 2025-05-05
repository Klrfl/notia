<script lang="ts">
  import { Checkbox } from "bits-ui"
  import Check from "lucide-svelte/icons/check"

  const { ...rest }: Checkbox.RootProps = $props()
</script>

<Checkbox.Root
  {...rest}
  class={[
    "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "outline outline-gray-200 dark:outline-slate-700",
    "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer",
    "aspect-square size-12 bg-white dark:bg-slate-800 p-4 rounded-lg",
    "data-[state=checked]:dark:bg-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:opacity-100",
    "text-white",
  ]}
>
  {#snippet children({ checked })}
    {#if checked}
      <Check size="1.2rem" />
    {/if}
  {/snippet}
</Checkbox.Root>
