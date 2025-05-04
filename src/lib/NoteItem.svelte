<script lang="ts">
  import type { Note } from "../types/"
  import AlertDialog from "@/lib/ui/AlertDialog.svelte"
  import Button from "@/lib/ui/Button.svelte"
  import Trash from "lucide-svelte/icons/trash"
  import DOMPurify from "dompurify"

  interface Props {
    note: Note
    isSelectingNote: boolean
    selectNote: (id: Note["id"]) => void
    editNote: (note: Note) => void
    deleteNote: (noteId: Note["id"]) => void
  }

  let { note, isSelectingNote, selectNote, editNote, deleteNote }: Props =
    $props()
</script>

<button
  class="size-full text-left grid gap-4 p-8 cursor-pointer"
  onclick={() => (!isSelectingNote ? editNote(note) : selectNote(note.id))}
>
  <h2 class="text-xl">{note.title}</h2>
  <article class="line-clamp-3 preview select-none">
    {@html DOMPurify.sanitize(note.content)}
  </article>

  <div
    class="@container grid gap-2 sm:gap-4 lg:justify-end *:min-w-max mt-auto"
  >
    <p
      class="col-span-full justify-self-end text-sm text-gray-500 dark:text-gray-300"
    >
      {Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(new Date(note.createdAt))}
    </p>

    <AlertDialog
      title="Note deletion"
      description="Are you sure you want to delete this?"
    >
      {#snippet trigger(props)}
        <Button {...props} icon variant="danger">
          <Trash size="1em" />
          Delete note
        </Button>
      {/snippet}

      {#snippet action()}
        <Button variant="danger" onclick={() => deleteNote(note.id)}>
          Yes, delete this note
        </Button>
      {/snippet}

      {#snippet cancel()}
        No
      {/snippet}
    </AlertDialog>

    <!--

    <AlertDialog.Root>
      <AlertDialog.Trigger onclick={(e) => e.stopImmediatePropagation()}>
        {#snippet child({ props })}
          <Button {...props} icon variant="danger">
            <Trash size="1rem" />
            Delete note
          </Button>
        {/snippet}
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay class="bg-black/80 absolute inset-0 z-10" />

        <AlertDialog.Content
          class={[
            "fixed left-0 right-0 bottom-0 md:top-[50%] size-fit md:-translate-y-1/2 max-w-6xl mx-auto z-20",
            "px-8 py-6 flex flex-col gap-4 outline outline-slate-200 dark:outline-slate-700 bg-white dark:bg-slate-800 rounded-lg",
          ]}
        >
          <AlertDialog.Title>
            {#snippet child({ props })}
              <h2 {...props} class="text-xl font-bold">Delete note?</h2>
            {/snippet}
          </AlertDialog.Title>

          <AlertDialog.Description>
            {#snippet child({ props })}
              <p {...props}>hey, you sure you want to delete this note?</p>
            {/snippet}
          </AlertDialog.Description>

          <div class="flex gap-4 justify-center">
            <AlertDialog.Action>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="danger"
                  onclick={() => deleteNote(note.id)}
                >
                  Yes
                </Button>
              {/snippet}
            </AlertDialog.Action>

            <AlertDialog.Cancel>
              {#snippet child({ props })}
                <Button {...props} variant="outline">No</Button>
              {/snippet}
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
-->
  </div>
</button>
