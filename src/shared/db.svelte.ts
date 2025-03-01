export let db = $state<IDBDatabase>()

export function openDB(): Promise<IDBDatabase> {
  const openRequest = window.indexedDB.open("testDB")

  return new Promise((resolve, reject) => {
    openRequest.addEventListener("upgradeneeded", () => {
      if (import.meta.env.DEV) console.log("no database yet...", openRequest)

      if (!db?.objectStoreNames.contains("notes")) {
        db?.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        })
      }

      return resolve(openRequest.result)
    })

    openRequest.addEventListener("success", () => {
      if (import.meta.env.DEV)
        console.log("established connection to database.")
      return resolve(openRequest.result)
    })

    openRequest.addEventListener("error", () => {
      return reject(new Error("error when connecting to database."))
    })
  })
}
