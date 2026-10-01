import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        theme_color: '#0b2a6f',
        background_color: '#f5f8fc',
        display: 'standalone',
        lang: 'es',
        start_url: '/',
        categories: ['business', 'productivity'],
        name: 'InnovaDigital',
        short_name: 'Innova',
        description:
          'Soluciones tecnológicas y creativas para impulsar la presencia digital de tu negocio.',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
})
