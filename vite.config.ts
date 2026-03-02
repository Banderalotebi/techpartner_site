import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { compression } from "vite-plugin-compression2";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80, lossless: true },
      avif: { quality: 70 }
    }),
    compression({ algorithms: ['brotliCompress'], exclude: [/\.(br)$/, /\.(gz)$/] }),
    compression({ algorithms: ['gzip'], exclude: [/\.(br)$/, /\.(gz)$/] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "assets_temp"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "index.html"),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('lucide-react') || id.includes('tailwind')) return 'vendor-ui';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('react-markdown') || id.includes('remark')) return 'vendor-markdown';
            return 'vendor-core'; 
          }
        }
      }
    },
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
