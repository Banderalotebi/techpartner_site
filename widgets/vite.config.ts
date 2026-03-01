import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'astrolabe.ts',
      name: 'DigitalAstrolabe',
      fileName: () => 'astrolabe.min.js',
      formats: ['iife'] // Creates a standard script tag format
    },
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        // Ensure clean build
        assetFileNames: 'astrolabe.[ext]'
      }
    }
  }
});
