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
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("react-redux") ||
              id.includes("@reduxjs/toolkit")
            ) {
              return "vendor-react";
            }
            if (id.includes("antd") || id.includes("@ant-design") || id.includes("rc-")) {
              return "vendor-antd";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "vendor-charts";
            }
            if (id.includes("jspdf") || id.includes("xlsx") || id.includes("html2canvas")) {
              return "vendor-export";
            }
            return "vendor";
          }
        },
      },
    },
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
