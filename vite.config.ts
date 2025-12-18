import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5174,
    strictPort: true,
    cors: true,

    proxy: {
      "/api": {
        target: "https://shyamsweet-api.webxnepal.com/api/v1/creative",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {});
          proxy.on("proxyReq", (proxyReq, req, _res) => {});
          proxy.on("proxyRes", (proxyRes, req, _res) => {});
        },
      },
    },
  },
});
