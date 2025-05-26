import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: './node_modules/.vite/saga-abilities',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SAGA Abilities Manager',
        short_name: 'SAGA Abilities',
        description:
          'An ability manager for SAGA TTRPG with advanced filtering and AbilityManual organization capabilities',
        theme_color: '#4c6ef5',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    cloudflare()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: false,
    cssCodeSplit: true,
    manifest: true,
    rollupOptions: {
      external: [
        /\.test\.(ts|tsx)$/,
        /\.spec\.(ts|tsx)$/,
        'vitest',
        '@testing-library/react',
        '@testing-library/jest-dom',
      ],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mantine-core': ['@mantine/core', '@mantine/hooks'],
          'mantine-extras': [
            '@mantine/dates',
            '@mantine/form',
            '@mantine/modals',
            '@mantine/notifications',
          ],
          'pdf-vendor': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'data-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-table',
            'zod',
          ],
          icons: ['@tabler/icons-react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mantine/core',
      '@mantine/hooks',
    ],
  },
  server: {
    open: true,
    port: 5173,
  },
  preview: {
    port: 5174,
    open: true,
    headers: {
      'Alt-Svc': 'h3=":443"; ma=86400',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
});

// Vitest configuration
export const testConfig = {
  globals: true,
  environment: 'jsdom',
  include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  reporters: ['default'],
  watch: false,
  setupFiles: './src/test/setup.ts',
  exclude: ['**/node_modules/**', '**/dist/**'],
  coverage: {
    reportsDirectory: './coverage/saga-abilities',
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['node_modules/'],
  },
};
