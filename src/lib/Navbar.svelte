<script>
  import Menu from "lucide-svelte/icons/menu"
  import Info from "lucide-svelte/icons/info"
  import X from "lucide-svelte/icons/x"

  import Button from "@/lib/ui/Button.svelte"
  import Dialog from "@/lib/ui/Dialog.svelte"

  const title = "Notia"

  let isAboutOpen = $state(false)
</script>

<header
  class="header col-span-full flex gap-4 items-center px-8 py-4 bg-white border-b border-b-gray-200"
>
  <h1 class="text-4xl text-slate-700">{title}</h1>

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
    variant="outline"
    size="sm"
    class="mt-auto ml-auto text-gray-700"
    icon
    onclick={() => (isAboutOpen = true)}
  >
    <Info />
    About Notia
  </Button>
</header>

<Dialog bind:isOpen={isAboutOpen} heading="About notia">
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

<style>
  @reference "@/app.css";

  .sidebar-toggle {
    @apply md:hidden p-4 cursor-pointer hover:bg-gray-200;
  }
</style>
