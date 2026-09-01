// Resolve a file that lives in /public against Vite's base URL.
// Vite rewrites asset URLs in index.html and imported modules, but NOT plain
// runtime strings like <img src="/crest.png"> — so under a subpath deploy
// (GitHub Pages project site, /cshac/) those would 404. Route them through here.
// import.meta.env.BASE_URL is "/" in dev and "/cshac/" in the Pages build, and
// always ends in a slash, so `${BASE_URL}crest.png` resolves correctly in both.
export function asset(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`
}
