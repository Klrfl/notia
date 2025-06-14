<script lang="ts">
  import CircleX from "lucide-svelte/icons/circle-x"
  import { Dialog } from "bits-ui"
  import type { Snippet } from "svelte"

  interface Props extends Dialog.RootProps {
    isOpen?: boolean
    size?: "sm" | "md" | "lg" | "full"
    heading: string
    description?: string
    trigger?: Snippet
    [key: string]: unknown
  }

  let {
    isOpen = $bindable(),
    size = "md",
    heading,
    children,
    description = "",
    trigger,
    ...restProps
  }: Props = $props()

  function getOpen() {
    return isOpen ?? false // don't worry this function won't execute if isOpen is undefined
  }

  function setOpen(open: boolean) {
    isOpen = open
  }
</script>

{#snippet child()}
  {#if trigger}
    <Dialog.Trigger>
      {#snippet child()}
        {@render trigger()}
      {/snippet}
    </Dialog.Trigger>
  {/if}

  <Dialog.Portal>
    <Dialog.Overlay
      class={[
        "fixed inset-0 z-20",
        "data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=closed]:scale-0 data-[state=open]:bg-black/80",
      ]}
    />
    <Dialog.Content
      class={[
        "origin-center transition-[opacity,transform] data-[state=closed]:animate-out",
        "fixed left-0 right-0 bottom-0 md:top-0 m-auto z-20",
        "bg-white dark:bg-slate-800 outline outline-slate-200 dark:outline-slate-700 rounded-lg shadow-lg overflow-auto h-max",
        size === "sm" && "max-w-2xl",
        size === "md" && "max-w-6xl",
        size === "lg" && "max-w-7xl",
        size === "full" && "max-w-full",
      ]}
    >
      <!-- wrapper for content, don't delete -->

      <header class="pt-8 px-8 flex justify-between items-center">
        <Dialog.Title>
          <h2 class="text-xl font-bold">{heading}</h2>
        </Dialog.Title>

        <Dialog.Description>
          {description}
        </Dialog.Description>

        <Dialog.Close>
          <button
            onclick={() => (isOpen = false)}
            class="cursor-pointer"
            title="close this dialog"
          >
            <CircleX class="hover:text-gray-600" />
          </button>
        </Dialog.Close>
      </header>

      <section class="p-8">
        {@render children?.()}
      </section>
    </Dialog.Content>
  </Dialog.Portal>
{/snippet}

{#if isOpen !== undefined}
  <Dialog.Root bind:open={getOpen, setOpen} {...restProps}>
    {@render child()}
  </Dialog.Root>
{:else}
  <Dialog.Root {...restProps}>
    {@render child()}
  </Dialog.Root>
{/if}
