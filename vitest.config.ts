import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'mask-icon.svg'],
      manifest: {
        name: 'SAGA Abilities Manager',
        short_name: 'SAGA Abilities',
        description: 'An ability manager for SAGA TTRPG with advanced filtering and AbilityManual organization capabilities',
        theme_color: '#4c6ef5',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    }),
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
    rollupOptions: {
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
          'data-vendor': ['@tanstack/react-query', '@tanstack/react-table', 'zod'],
          'icons': ['@tabler/icons-react'],
        }
      },
    },
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: false,
    cssCodeSplit: true,
    manifest: true,
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
  }, test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',  // Using V8 coverage provider
      reporter: ['text', 'html', 'lcov', 'json'],  // Multiple report formats
      exclude: [
        'node_modules/**',
        '**/*.d.ts',
        '**/dist/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test/**',
        '**/.vscode/**',
        '**/codeql-database/**',
        '**/vitest.config.ts',
        '**/vite.config.ts',
        'src/main.tsx',
      ],
      reportsDirectory: './coverage',
      all: true  // Include non-tested files in report
      // thresholds disabled while developing tests
      // thresholds: {
      //   lines: 70,
      //   branches: 70,
      //   functions: 70,
      //   statements: 70
      // }
    }
  }
});
