import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/v1/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/hotels': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/v1/bookings': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/v1/reviews': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/auth/google': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
})
