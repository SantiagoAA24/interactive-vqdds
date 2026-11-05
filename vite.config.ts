import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/interactive-vqdds/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/axe.setup.ts'],
  },
})

