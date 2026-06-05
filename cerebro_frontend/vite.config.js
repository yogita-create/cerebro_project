import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://cerebro-project-02f7.onrender.com",
        changeOrigin: true
      }
    }
  }
})
