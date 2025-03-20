const THEME_KEY = "notia-theme"
type Theme = "light" | "dark"

export function setTheme(theme: Theme) {
  const body = document.body
  body.className = ""

  localStorage.setItem(THEME_KEY, theme)
  return body.classList.toggle(theme)
}

export function getTheme(): Theme {
  const likesDark = window.matchMedia("(prefers-color-theme: dark)").matches
  let existing = localStorage.getItem(THEME_KEY) as Theme

  const valid = ["dark", "light"].includes(existing)
  if (existing === null || !valid) {
    existing = likesDark ? "dark" : "light"
  }

  return existing
}
