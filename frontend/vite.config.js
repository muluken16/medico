import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fullday.medicodigitals.com',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'https://fullday.medicodigitals.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
