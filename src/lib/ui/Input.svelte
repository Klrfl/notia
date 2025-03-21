<script lang="ts">
  interface Props {
    value: string
    class?: string | string[]
    [key: string]: unknown
  }

  let { value = $bindable(""), class: className, ...rest }: Props = $props()
</script>

<input
  bind:value
  class={[
    "bg-gray-200/50 dark:bg-slate-900/50 focus-visible:outline focus-visible:outline-gray-500 px-4 py-2",
    className,
  ]}
  {...rest}
/>
