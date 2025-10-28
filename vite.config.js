import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Para usar describe/it/expect sin importar
    setupFiles: './src/setupTests.js', // Opcional
    include: ['src/tests/**/*.test.{js,jsx,ts,tsx}'], // only this folder
    exclude: ['src/App.test.*'] // optional: explicitly ignore default CRA test
  }
})
