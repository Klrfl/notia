import type { Note } from "@/types"

export async function openDB(): Promise<IDBDatabase> {
  let db = $state<IDBDatabase>()

  const openRequest = window.indexedDB.open("notia", 2)

  return new Promise((resolve, reject) => {
    openRequest.addEventListener("upgradeneeded", ({ oldVersion }) => {
      if (oldVersion === 0) {
        if (import.meta.env.DEV) console.log("no database yet...", openRequest)
      }

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

    openRequest.addEventListener("success", (e) => {
      db = openRequest.result

      if ((e.target as IDBOpenDBRequest).result.version < 2) {
        // add trash field in v2
        const notesTx = db.transaction("notes", "readwrite")
        const notesCursor = notesTx.objectStore("notes").openCursor()

        notesCursor.addEventListener("success", () => {
          const cursor = notesCursor.result
          if (!cursor) return

          const note = cursor.value as Note
          note["trashedAt"] = null

          const req = cursor.update(note)
          req.addEventListener("error", (e) =>
            console.error("something went wrong", e)
          )

          cursor.continue()
        })
      }

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
