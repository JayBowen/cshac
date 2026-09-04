import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Match the router to Vite's base ("/cshac" on Pages, "" at root/in dev) so
// route paths line up with where the app is served.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

// Without this, the browser's own scroll restoration can re-apply a reload's
// previous scroll position after ScrollManager's scroll-to-top already ran —
// a race that's especially likely on pages like Gallery, where content loads
// in asynchronously and keeps growing the page height for a moment after mount.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
