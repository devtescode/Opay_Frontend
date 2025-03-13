import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Ensures the install prompt appears
      manifest: {
        name: "Opay",
        short_name: "Opay",
        start_url: "/opaydb",
        display: "standalone",
        theme_color: "#ffffff", 
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      devOptions: {
        enabled: true, // Allows PWA to work in development mode
        type: 'module',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
