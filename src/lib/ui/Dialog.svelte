<script lang="ts">
  import { CircleX } from "lucide-svelte"

  interface Props {
    isOpen: boolean
    heading: string
    children: any
  }

  let { isOpen = $bindable(false), heading, children }: Props = $props()
  let dialog = $state<HTMLDialogElement>()

  $effect(() => {
    isOpen ? dialog!.showModal() : dialog!.close()
  })
</script>

<dialog
  bind:this={dialog}
  onclose={() => (isOpen = false)}
  class="grid not-open:translate-y-1 open:translate-y-0 not-open:pointer-events-none not-open:opacity-0 open:opacity-100 transition-opacity mt-auto md:mx-auto md:my-auto rounded-lg backdrop:backdrop-blur-lg backdrop:bg-black/50"
  style="width: min(var(--container-7xl), 100%)"
>
  <header class="pt-8 px-8 flex justify-between items-center">
    <h2>{heading}</h2>

    <button
      onclick={() => (isOpen = false)}
      class="cursor-pointer"
      title="close this dialog"
    >
      <CircleX class="hover:text-gray-600" />
    </button>
  </header>

  <section class="p-8">
    {#if children}
      {@render children()}
    {/if}
  </section>
</dialog>
