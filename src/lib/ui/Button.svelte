<script lang="ts">
  interface Props {
    children: any
    class?: string | string[]
    [key: string]: unknown
  }

  const { children, class: className = "", ...rest }: Props = $props()
</script>

<button
  type="submit"
  class={[
    "px-6 py-4 cursor-pointer flex gap-4 justify-center items-center focus-visible:outline focus-visible:outline-gray-900",
    className,
  ]}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    button label
  {/if}
</button>
