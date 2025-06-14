<script lang="ts">
  import Button from "../ui/Button.svelte"
  import { AlertDialog } from "bits-ui"
  import type { Snippet } from "svelte"

  interface Props extends AlertDialog.RootProps {
    title: string
    titleLevel?: AlertDialog.TitleProps["level"]
    description: string
    trigger?: Snippet<[Record<string, unknown>]>
    action?: Snippet<[Record<string, unknown>]>
    cancel?: Snippet
  }

  let {
    open = $bindable(false),
    cancel,
    action,
    children,
    trigger,
    title,
    titleLevel,
    description,
    ...rest
  }: Props = $props()
</script>

<AlertDialog.Root bind:open {...rest}>
  <AlertDialog.Trigger onclick={(e) => e.stopImmediatePropagation()}>
    {#snippet child({ props })}
      {@render trigger?.(props)}
    {/snippet}
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay class="bg-black/80 absolute inset-0 z-10 " />

    <AlertDialog.Content
      class={[
        "transition-[transform,opacity] data-[state=closed]:animate-out",
        "fixed left-0 right-0 bottom-0 md:top-[50%] size-fit md:-translate-y-1/2 max-w-6xl mx-auto z-20",
        "px-8 py-6 flex flex-col gap-4 outline outline-slate-200 dark:outline-slate-700 bg-white dark:bg-slate-800 rounded-lg",
      ]}
    >
      <AlertDialog.Title class="text-xl font-bold" level={titleLevel}>
        {title}
      </AlertDialog.Title>

      <AlertDialog.Description>
        {#snippet child({ props })}
          <p {...props}>{description}</p>
        {/snippet}

        {@render children?.()}
      </AlertDialog.Description>

      <div class="flex gap-4 justify-center">
        <AlertDialog.Action>
          {#snippet child({ props })}
            {#if action}
              {@render action(props)}
            {:else}
              <Button {...props}>Yes</Button>
            {/if}
          {/snippet}
        </AlertDialog.Action>

        <AlertDialog.Cancel>
          {#snippet child({ props })}
            <Button {...props} variant="outline">{@render cancel?.()}</Button>
          {/snippet}
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

<!-- usage -->

<!--
<AlertDialog title="Note deletion" titleLevel={2} description="Are you sure to delete this?">
  {#snippet trigger(props)}
    <Button {...props} variant="danger" onclick={apakek}>
      Click me
    </Button>
  {/snippet}

  {#snippet action(props)}
    <Button {...props} variant="danger" onclick={apakek}>
      Yes
    </Button>
  {/snippet}
  
  for cancel button, render text only
  because the button always has no action
  and therefore always looks the same

  {#snippet cancel()}
      No
  {/snippet}
</AlertDialog>
  -->
