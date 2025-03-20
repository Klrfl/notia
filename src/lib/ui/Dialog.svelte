<script lang="ts">
  import type { HTMLDialogAttributes } from "svelte/elements"
  import CircleX from "lucide-svelte/icons/circle-x"
  import { Dialog } from "bits-ui"

  interface Props extends HTMLDialogAttributes {
    isOpen: boolean
    heading: string
    description?: string
    [key: string]: unknown
  }

  let {
    isOpen = $bindable(false),
    heading,
    children,
    description = "",
    ...restProps
  }: Props = $props()
</script>

<Dialog.Root bind:open={isOpen} {...restProps}>
  <Dialog.Portal>
    <Dialog.Overlay
      class={[
        "fixed inset-0 z-20",
        "data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=closed]:scale-0 data-[state=open]:bg-black/80",
      ]}
    />
    <Dialog.Content
      class={[
        "dialog-content",
        "fixed left-0 right-0 bottom-0 max-w-6xl mx-auto z-20",
        "bg-white rounded-lg shadow-lg",
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
</Dialog.Root>

<style>
  :global(.dialog-content) {
    transition: transform 200ms ease;
  }

  :global(.dialog-content[data-state="open"]) {
    transform: translateY(0);
  }

  :global(.dialog-content[data-state="closed"]) {
    transform: translateY(50vh);
    background: red;
  }
</style>
