<script>
  import Button from "@/lib/ui/Button.svelte"
  import Dialog from "@/lib/ui/Dialog.svelte"

  import Menu from "lucide-svelte/icons/menu"
  import Info from "lucide-svelte/icons/info"
  import X from "lucide-svelte/icons/x"
  import Moon from "lucide-svelte/icons/moon"
  import Sun from "lucide-svelte/icons/sun"

  import { onMount } from "svelte"
  import { setTheme, getTheme } from "@/shared/dark"

  const title = "Notia"
  let isOpen = $state(false)
  let preferredTheme = $state(getTheme())

  onMount(() => setTheme(preferredTheme))
</script>

<header
  class={[
    "header col-span-full flex gap-4 items-center px-8 py-4",
    "bg-white dark:bg-slate-800 border-b border-b-slate-200 dark:border-b-slate-700",
  ]}
>
  <h1 class="text-4xl">{title}</h1>

  <div class="order-first">
    <input
      type="checkbox"
      name="sidebar-toggle"
      id="sidebar-toggle"
      class="peer hidden"
    />

    <label
      for="sidebar-toggle"
      class="sidebar-toggle block peer-checked:hidden"
    >
      <Menu />
      <div class="sr-only">Open sidebar</div>
    </label>

    <label
      for="sidebar-toggle"
      class="sidebar-toggle hidden peer-checked:block"
    >
      <X />
      <div class="sr-only">Close sidebar</div>
    </label>
  </div>

  <Button
    class="ml-auto hover:bg-gray-200"
    variant="none"
    size="sm"
    onclick={() => {
      preferredTheme = preferredTheme === "light" ? "dark" : "light"
      setTheme(preferredTheme)
    }}
  >
    {#if preferredTheme === "light"}
      <Moon />
    {:else}
      <Sun />
    {/if}
  </Button>

  <Button variant="outline" size="sm" icon onclick={() => (isOpen = true)}>
    <Info />
    About Notia
  </Button>

  <Dialog bind:isOpen heading="About notia">
    {#snippet trigger()}{/snippet}

    <article class="preview">
      <p>
        Notia is a really light markdown-based notetaking app I made to learn
        Svelte. It was an interesting experience to learn this framework!
      </p>

      <p>
        This application stores all of its data locally in your browser, so your
        notes never leave your device.
      </p>

      <p>If you enjoyed this app, please give it a star in Github. ⭐</p>
      <a
        href="https://github.com/klrfl/notia"
        target="_blank"
        class="text-blue-500 hover:text-blue-700 hover:underline">Notia</a
      >
    </article>
  </Dialog>
</header>

<style>
  @reference "@/app.css";

  .sidebar-toggle {
    @apply md:hidden px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-900/50;
  }
</style>
