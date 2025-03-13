<script>
  import Menu from "lucide-svelte/icons/menu"
  import X from "lucide-svelte/icons/x"

  const title = "Notia"
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
  >
    <h1 class="text-4xl text-slate-700">{title}</h1>
</header>




<style>
  @reference "@/app.css";

  .sidebar-toggle {
    @apply md:hidden p-4 cursor-pointer hover:bg-gray-200;
  }
</style>
