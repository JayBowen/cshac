import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Deployed to two targets with different URL roots:
//   - S3 + CloudFront serves from the domain root -> base '/'  (the default)
//   - GitHub Pages project site lives under /cshac/ -> its workflow sets VITE_BASE=/cshac/
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
