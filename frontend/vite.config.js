import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    allowedHosts: [
      "all", // allows all external hosts including Cloudflare Tunnel
      "localhost",
      "127.0.0.1",
      "relation-notebooks-melbourne-ga.trycloudflare.com", // <-- Specific url
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
