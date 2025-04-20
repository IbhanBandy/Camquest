import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from "path";

// Simplified Vite config:
// - Serve from the 'client' directory
// - Load environment variables from project root (.env)
// - Output build to 'dist/public'
export default defineConfig({
  root: path.resolve(process.cwd(), "client"),
  envDir: process.cwd(),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
});
