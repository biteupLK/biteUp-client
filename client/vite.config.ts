import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8084',
        ws: true,
        changeOrigin: true
      }
    },
    watch:{
      usePolling:true
    },
  }, 
  define: {
    global: {},
  },
});
