import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import viteCompression from 'vite-plugin-compression';


export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      treeshake: true,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})