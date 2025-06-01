<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { Button } from "bits-ui"
  import { twMerge } from "tailwind-merge"

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
  class={twMerge([
    "cursor-pointer focus-visible:outline-4 focus-visible:outline-gray-900 active:translate-y-1 transition-colors text-inherit dark:hover:bg-slate-900/50",
    icon && "flex gap-4 justify-center items-center",
    variant === "primary" &&
      "bg-blue-400 hover:bg-blue-500 text-white dark:text-gray-200",
    variant === "outline" &&
      "outline-2 outline-slate-200 dark:outline-slate-700 hover:bg-slate-200/50",
    variant === "danger" &&
      "bg-red-400 hover:bg-red-500 text-white dark:text-gray-200",

    size === "sm" && "px-4 py-3 text-sm",
    size === "base" && "px-6 py-4",
    size === "lg" && "px-8 py-6 text-lg",
    className,
  ])}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    button label
  {/if}
</Button.Root>
