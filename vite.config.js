import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: '/Mora/',
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        "name": "Mora",
        "short_name": "Mora",
        "start_url": "/Mora/",
        "scope": "/Mora/",
        "display": "standalone",
        "background_color": "#121212",
        "theme_color": "#4A5563",
        "icons": [
          {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ],
})
