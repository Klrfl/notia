<script lang="ts">
  import type { HTMLDialogAttributes } from "svelte/elements"
  import CircleX from "lucide-svelte/icons/circle-x"

  interface Props extends HTMLDialogAttributes {
    isOpen: boolean
    heading: string
  }

  let { isOpen = $bindable(false), heading, children }: Props = $props()
  let dialog = $state<HTMLDialogElement>()

  $effect(() => (isOpen ? dialog!.showModal() : dialog!.close()))
</script>

<dialog
  bind:this={dialog}
  onclose={() => (isOpen = false)}
  class={[
    "fixed inset-0",
    "grid not-open:translate-y-10 md:not-open:-translate-y-4 open:translate-y-0",
    "not-open:pointer-events-none not-open:opacity-0 open:opacity-100",
    "transition duration-300 ease-in-out",
    "mt-auto md:mx-auto md:my-auto",
    "rounded-lg shadow-lg backdrop:backdrop-blur-sm",
    "w-full max-w-6xl",
  ]}
  inert={!isOpen}
>
  <header class="pt-8 px-8 flex justify-between items-center">
    <h2 class="text-xl font-bold">{heading}</h2>

    <button
      onclick={() => (isOpen = false)}
      class="cursor-pointer"
      title="close this dialog"
    >
      <CircleX class="hover:text-gray-600" />
    </button>
  </header>

  <section class="p-8">
    {@render children?.()}
  </section>
</dialog>
