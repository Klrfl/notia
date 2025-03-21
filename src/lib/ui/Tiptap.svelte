<script lang="ts">
  import { Editor } from "@tiptap/core"
  import StarterKit from "@tiptap/starter-kit"
  import { onMount } from "svelte"

  import TextQuote from "lucide-svelte/icons/text-quote"
  import OrderedList from "lucide-svelte/icons/list-ordered"

  import Heading_1 from "lucide-svelte/icons/heading-1"
  import Heading_2 from "lucide-svelte/icons/heading-2"
  import Heading_3 from "lucide-svelte/icons/heading-3"
  import Heading_4 from "lucide-svelte/icons/heading-4"

  import List from "lucide-svelte/icons/list"
  import Bold from "lucide-svelte/icons/bold"
  import Italic from "lucide-svelte/icons/italic"
  import Strike from "lucide-svelte/icons/strikethrough"
  import Code from "lucide-svelte/icons/code"

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
            "p-4 min-h-[50vh] bg-gray-200/50 dark:bg-slate-900/50",
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

    return () => {
      if (editor) editor.destroy()
      editor = null
    }
  })
</script>

{#if editor}
  <header
    class="flex items-center border-2 border-gray-300 dark:border-slate-700 overflow-x-auto"
  >
    <div class="group">
      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading_1 />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading_2 />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading_3 />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading_4 />
      </button>
    </div>

    <div class="group">
      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strike />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </button>
    </div>

    <div class="group">
      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleBulletList().focus().run()}
      >
        <List />
      </button>

      <button
        type="button"
        class="tiptap-btn"
        onclick={() => editor.chain().focus().toggleOrderedList().focus().run()}
      >
        <OrderedList />
      </button>
    </div>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().setBlockquote().run()}
    >
      <TextQuote />
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().setCodeBlock().run()}
    >
      <Code />
    </button>
  </header>
{/if}

<div class="preview" bind:this={editorElement}></div>

<style>
  @reference "@/app.css";

  .group {
    display: flex;
    border-inline-end: 2px solid;
    border-color: inherit;
  }

  .tiptap-btn {
    @apply leading-snug block py-2 px-4 hover:bg-gray-300/50 cursor-pointer transition-colors;
  }
</style>
