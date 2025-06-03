// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/' // required for Vercel so paths resolve from domain root
})

console.log("Vite config loaded");
