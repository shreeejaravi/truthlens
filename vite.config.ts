import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Expose to all network interfaces
    port: 5173,
    strictPort: false, // Allow fallback to another port if 5173 is taken
    open: true // Open browser automatically
  },
});
