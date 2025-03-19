<script lang="ts">
  import { Editor } from "@tiptap/core"
  import StarterKit from "@tiptap/starter-kit"
  import { onDestroy, onMount } from "svelte"

  interface Props {
    class?: string | string[]
    content?: string
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
          class:
            typeof className === "string" ? className : className.join(" "),
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
      H1
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive("heading", { level: 2 })}
    >
      H2
    </button>

    <button
      type="button"
      class="tiptap-btn"
      onclick={() => editor.chain().focus().setParagraph().run()}
      class:active={editor.isActive("paragraph")}
    >
      P
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
