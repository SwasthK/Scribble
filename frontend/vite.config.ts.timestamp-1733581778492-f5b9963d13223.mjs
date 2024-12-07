// vite.config.ts
import { defineConfig } from "file:///D:/Medium/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Medium/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import viteCompression from "file:///D:/Medium/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
import tailwindcss from "file:///D:/Medium/frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///D:/Medium/frontend/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "D:\\Medium\\frontend";
var vite_config_default = defineConfig({
  plugins: [react(), viteCompression({
    filter: /\.(js|mjs|json|css|html|tsx|ts|map)$/i,
    algorithm: "brotliCompress",
    threshold: 512,
    ext: ".br"
  })],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  build: {
    rollupOptions: {
      treeshake: true
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNZWRpdW1cXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE1lZGl1bVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTWVkaXVtL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHZpdGVDb21wcmVzc2lvbih7XG4gICAgZmlsdGVyOiAvXFwuKGpzfG1qc3xqc29ufGNzc3xodG1sfHRzeHx0c3xtYXApJC9pLFxuICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICB0aHJlc2hvbGQ6IDUxMixcbiAgICBleHQ6ICcuYnInLFxuICB9KV0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICAgICAgYXV0b3ByZWZpeGVyKCksXG4gICAgICBdXG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHRyZWVzaGFrZTogdHJ1ZSxcbiAgICB9XG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcbiAgICB9XG4gIH0sXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBOE8sU0FBUyxvQkFBb0I7QUFDM1EsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjtBQUx6QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLGdCQUFnQjtBQUFBLElBQ2pDLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxFQUNQLENBQUMsQ0FBQztBQUFBLEVBQ0YsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1AsWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
