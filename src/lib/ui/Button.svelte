<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { Button } from "bits-ui"

  interface Props extends HTMLButtonAttributes {
    class?: string | string[]
    icon?: boolean
    variant?: "outline" | "primary" | "danger" | "none"
    size?: "sm" | "base" | "lg" | "xl"
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
    variant === "outline" &&
      "outline-2 outline-slate-200 hover:bg-slate-200/50",
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
