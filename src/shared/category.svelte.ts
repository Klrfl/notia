import type { NoteCategory } from "@/types"

export class CategoryService {
  db: IDBDatabase
  categories: NoteCategory[] = $state([])

  constructor(db: IDBDatabase) {
    this.db = db
  }

  getAllCategories() {
    return new Promise((resolve, reject) => {
      const categoriesTx = this.db.transaction("categories")
      const noteCategoriesReq = categoriesTx.objectStore("categories").getAll()

      noteCategoriesReq.addEventListener("success", () => {
        this.categories = noteCategoriesReq.result
        return resolve(this.categories)
      })

      noteCategoriesReq.addEventListener("error", () => {
        return reject(noteCategoriesReq.error)
      })
    })
  }

  addCategory(name: NoteCategory["name"]) {
    return new Promise((resolve, reject) => {
      const categoryStore = this.db
        ?.transaction("categories", "readwrite")
        .objectStore("categories")

      const req = categoryStore?.add({ name })

      req?.addEventListener("success", () => {
        const returnReq = categoryStore?.get(req.result)

        returnReq?.addEventListener("success", () => {
          this.categories.push(returnReq.result)
          resolve(this.categories)
        })

        returnReq.addEventListener("error", () => reject(returnReq.error))
      })
    })
  }

  editCategory(newCategory: NoteCategory) {
    return new Promise((resolve, reject) => {
      const tx = this.db?.transaction("categories", "readwrite")
      const req = tx?.objectStore("categories").put(newCategory)

      req?.addEventListener("success", () => {
        this.categories.splice(
          this.categories.indexOf(newCategory),
          1,
          newCategory
        )

        resolve(newCategory)
      })
    })
  }

  deleteCategory(categoryId: NoteCategory["id"]) {
    return new Promise((resolve) => {
      const categoryStore = this.db
        ?.transaction("categories", "readwrite")
        .objectStore("categories")
      const req = categoryStore?.delete(categoryId)

      req?.addEventListener("success", () => {
        this.categories = this.categories.filter(({ id }) => id !== categoryId)
        return resolve(undefined)
      })
    })
  }
}
