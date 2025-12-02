import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Para usar describe/it/expect sin importar
    setupFiles: './src/setupTests.js', // Opcional
    include: ['src/tests/**/*.test.{js,jsx,ts,tsx}'], // only this folder
    exclude: ['src/App.test.*'], // optional: explicitly ignore default CRA test
    coverage: {
      exclude: ['**/*.css']
    }
  },
  server: {
    proxy: {
      // reenvía llamadas /api/* a servidor Backend http://localhost:9090
      '/api': {
        // Aquí debe reemplazarse localhost por la IP del Servidor Backend.
        // La URL base debe definirse en las variables de entorno de Vite.
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
