<script lang="ts">
  import { onMount } from "svelte"
  import { CategoryService } from "@/shared/category.svelte"
  import { openDB } from "@/shared/db.svelte"
  import NoteList from "@/lib/NoteList.svelte"
  import HomeSidebar from "@/lib/HomeSidebar.svelte"

  let db: IDBDatabase | undefined = $state()
  let categoryService: CategoryService | undefined = $state()

  onMount(async () => {
    try {
      db = await openDB()
      categoryService = new CategoryService(db)

      await categoryService.getAllCategories()
    } catch (error) {
      return console.error(error)
    }
  })
</script>

<main class="main-grid">
  <HomeSidebar />

  {#if categoryService}
    {#await categoryService.getAllCategories() then categories}
      <NoteList {categories} />
    {/await}
  {/if}
</main>

<style>
  @reference "@/app.css";

  .main-grid {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns:
      [sidebar-start]
      max-content
      [sidebar-end content-start]
      repeat(10, 1fr)
      [content-end];
  }

  .sidebar {
    grid-column: sidebar;

    @media screen and (max-width: 768px) {
      translate: -100% 0;
      transition: translate 200ms ease;
      left: 0;
      right: 0;
    }
  }

  :global(body:has(#sidebar-toggle:checked) .sidebar) {
    translate: 0;

    @media screen and (min-width: 768px) {
      translate: 0;
    }
  }

  /* disable scroll when menu is open */
  :global(body:has(#sidebar-toggle:checked)) {
    @media screen and (max-width: 768px) {
      max-height: 100vh;
      overflow: hidden;
    }
  }
</style>
