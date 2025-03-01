<script lang="ts">
  import { Button } from "bits-ui"

  interface Props {
    children: any
    class?: string | string[]
    icon?: boolean
    variant?: "outline" | "primary" | "danger"
    size?: "sm" | "base" | "lg" | "xl"
    [key: string]: unknown
  }

  const {
    children,
    class: className = "",
    icon = false,
    variant = "primary",
    size = "base",
    ...rest
  }: Props = $props()
</script>

<Button.Root
  class={[
    "cursor-pointer focus-visible:outline-2 focus-visible:outline-gray-900 active:translate-y-1 transition-colors",
    className,
    icon && "flex gap-4 justify-center items-center",
    variant === "primary" && "bg-blue-400 hover:bg-blue-500 text-white",
    variant === "danger" && "bg-red-400 hover:bg-red-500 text-white",
    size === "sm" && "px-4 py-3 text-sm",
    size === "base" && "px-6 py-4",
    size === "lg" && "px-8 py-6 text-lg",
  ]}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    button label
  {/if}
</Button.Root>
