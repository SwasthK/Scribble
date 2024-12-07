import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';


export default defineConfig({
  plugins: [react(), viteCompression({
    filter: /\.(js|mjs|json|css|html|tsx|ts|map)$/i,
    algorithm: 'brotliCompress',
    threshold: 512,
    ext: '.br',
  })],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ]
    }
  },
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