import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_APP_BASE || '/',
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      host: true, // For 'npm run preview'
      port: 4173,
    },
    plugins: [react()],
    build: {
      // 你甚至可以決定輸出的資料夾名稱
      outDir: mode === 'apache' ? 'dist-apache' : 'dist'
    }
  }
})