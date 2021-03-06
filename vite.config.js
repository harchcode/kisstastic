import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3400,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
});
