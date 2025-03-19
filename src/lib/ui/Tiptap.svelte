<script lang="ts">
  import { Editor } from "@tiptap/core"
  import StarterKit from "@tiptap/starter-kit"
  import { onDestroy, onMount } from "svelte"

  import TextQuote from "lucide-svelte/icons/text-quote"
  import Heading_1 from "lucide-svelte/icons/heading-1"
  import Heading_2 from "lucide-svelte/icons/heading-2"
  import Heading_3 from "lucide-svelte/icons/heading-3"
  import Heading_4 from "lucide-svelte/icons/heading-4"

  interface Props {
    class?: string | string[]
    content?: string
    [key: string]: unknown
  }

  let { content = $bindable(""), class: className = "" }: Props = $props()

  let editorElement = $state<HTMLElement>()
  let editor: Editor | null = $state(null)

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [StarterKit],
      content,
      editorProps: {
        attributes: {
          class: [
            "p-4",
            typeof className === "string" ? className : className.join(" "),
          ]
            .flat()
            .join(" "),
        },
      },
      onTransaction: () => {
        editor = editor
        content = editor.getHTML()
      },
    })
  })

  onDestroy(() => {
    if (editor) editor.destroy()
  })
</script>

<header class="flex items-center outline-2 outline-gray-200">
  {#if editor}
    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      class:active={editor.isActive("heading", { level: 1 })}
    >
      <Heading_1 />
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive("heading", { level: 2 })}
    >
      <Heading_2 />
    </button>
    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive("heading", { level: 2 })}
    >
      <Heading_3 />
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive("heading", { level: 2 })}
    >
      <Heading_4 />
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().setParagraph().run()}
      class:active={editor.isActive("paragraph")}
    >
      P
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().setBlockquote().run()}
    >
      <TextQuote />
    </button>
  {/if}
</header>

<div class="preview" bind:this={editorElement}></div>

<style>
  @reference "@/app.css";

  .tiptap-btn {
    @apply leading-snug block py-2 px-4 hover:bg-gray-200 cursor-pointer;
  }
</style>
