import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the page runs on port 5173 and passes API calls to the backend on port 8000.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
