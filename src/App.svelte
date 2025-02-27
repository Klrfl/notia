<script lang="ts">
  let title = "Notia"
  const notes = $state([
    {
      id: 1,
      title: "a note",
      content: "i would like to learn svelte.. like right now",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "another note",
      content: "finish this markdown notetaking app",
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ])
</script>

<main>
  <h1>{title}</h1>

  <ul>
    {#each notes as note}
      <li>
        <h2>{note.title}</h2>
        <p>{note.content}</p>

        <p>
          Created at {Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(note.createdAt)}
        </p>
        <p>
          Last updated at {Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(note.updatedAt)}
        </p>
      </li>
    {/each}
  </ul>
</main>
