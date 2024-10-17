import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path to match your deployment environment
  base: '/',
  // Add build options if needed (for optimizations or specific build needs)
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Ensures a single JS bundle for SPA
      },
    },
  },
  // Add server options to match the file structure if required
  server: {
    fs: {
      strict: false, // Allows access to the file system outside the root directory if needed
    },
  },
});
