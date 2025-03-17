<script lang="ts">
  import { Router, Route } from "svelte-routing"
  import Home from "./pages/Home.svelte"
  import Navbar from "@/lib/Navbar.svelte"

  const { url = "" } = $props()
</script>

<Router {url}>
  <Navbar />

  <Route path="/">
    <Home />
  </Route>
</Router>

<style>
  :global(#app) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
