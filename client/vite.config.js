import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "^/api/v1/user": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "^/images": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "^/antyodayaImages": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 4000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/test/",
        "src/main.jsx",
        "src/assets/",
      ],
    },
  },
});
