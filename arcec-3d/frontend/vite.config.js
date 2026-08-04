import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    // El resultado de "npm run build" se genera directo dentro del backend,
    // así Express puede servirlo sin que tengas que copiar nada a mano.
    outDir: path.resolve(__dirname, '../backend/public'),
    emptyOutDir: true
  }
})