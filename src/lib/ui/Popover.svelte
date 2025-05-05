<script lang="ts">
  import { Popover } from "bits-ui"
  import { Snippet } from "svelte"

  interface Props extends Popover.RootProps {
    open?: boolean
    trigger: Snippet<[Record<string, unknown>]>
    children: Snippet
  }

  let { open = $bindable(false), children, trigger, ...rest }: Props = $props()
</script>

<Popover.Root bind:open {...rest}>
  <Popover.Trigger>
    {#snippet child({ props })}
      {@render trigger(props)}
    {/snippet}
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="flex flex-col gap-4 bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-lg right-0"
      sideOffset={8}
    >
      {@render children()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
