import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: '/manifest.webmanifest', // Load from public/manifest.json
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',

        // Separate vendor code into its own chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Creates a vendor chunk for dependencies
          }
        },
      },
    },
  },
});
