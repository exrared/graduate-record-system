import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'My React PWA',
        short_name: 'ReactPWA',
        description: 'My React + Vite Progressive Web App',

        theme_color: '#ffffff',
        background_color: '#ffffff',

        display: 'standalone',
        start_url: '/',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],

        // ✅ ADD THIS (fix warning)
        screenshots: [
          {
            src: '/screenshot-mobile.png',
            sizes: '540x720',
            type: 'image/png'
          },
          {
            src: '/screenshot-desktop.png',
            sizes: '1340x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],

        // ✅ OPTIONAL (boost Lighthouse score)
        categories: ['productivity', 'business'],
        orientation: 'portrait'
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/127\.0\.0\.1:8000\/api/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      }
    })
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})