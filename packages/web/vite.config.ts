import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "src/main.tsx",
      
      output: {dir: "../../build/web",}
    },
    emptyOutDir: true,
  },
  server: {
    origin: "http://localhost:5173",
  },
  logLevel: "warn",
});
