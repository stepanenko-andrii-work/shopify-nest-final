import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import * as path from "path";
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
    "process.env.SHOP": JSON.stringify(process.env.SHOP),
    "process.env.HOST": JSON.stringify(process.env.HOST),
  },
  base: "/static/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), "index.html"),
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.HOST,
        changeOrigin: true,
      },
    },
  },
});
