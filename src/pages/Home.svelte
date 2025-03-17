<script lang="ts">
  import HomeSidebar from "@/lib/HomeSidebar.svelte"
  import NoteList from "@/lib/NoteList.svelte"
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
