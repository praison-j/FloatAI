import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use the repo path on GitHub Pages, and relative paths for local/Electron builds.
  base: process.env.GITHUB_ACTIONS ? '/FloatAI/' : './',
})
