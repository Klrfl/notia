<script lang="ts">
  import NoteList from "@/lib/NoteList.svelte"
  import HomeSidebar from "@/lib/HomeSidebar.svelte"
</script>

<main class="main-grid">
  <HomeSidebar />
  <NoteList />
</main>

<style>
  .main-grid {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns:
      [sidebar-start]
      max-content
      [sidebar-end content-start]
      repeat(10, 1fr)
      [content-end];
    flex-grow: 1;
  }
</style>
