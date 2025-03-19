export async function openDB(): Promise<IDBDatabase> {
  let db = $state<IDBDatabase>()

  const openRequest = window.indexedDB.open("notia", 1)

  return new Promise((resolve, reject) => {
    openRequest.addEventListener("upgradeneeded", () => {
      if (import.meta.env.DEV) console.log("no database yet...", openRequest)

      // create necessary object stores
      // to store notes and categories
      db = openRequest.result

      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        })
      }

      if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", {
          keyPath: "id",
          autoIncrement: true,
        })
      }
    })

    openRequest.addEventListener("success", () => {
      db = openRequest.result
      resolve(db)
      return console.log("connection established to database.")
    })

    openRequest.addEventListener("error", () => {
      reject(openRequest.error)
      console.log("there was an error when connecting to database.")
    })
  })
}

export const db = await openDB()
