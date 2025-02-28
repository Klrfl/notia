<script lang="ts">
  const { children, class: className, ...rest } = $props()
</script>

<button
  type="submit"
  class={["px-6 py-4 cursor-pointer flex gap-4 justify-center", className]}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    button label
  {/if}
</button>
