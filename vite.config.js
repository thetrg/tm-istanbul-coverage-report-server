import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    outDir: fileURLToPath (new URL ('./public', import.meta.url)),
  },
  publicDir: '../../../public',
  resolve: {
    alias: {
      "@": fileURLToPath (new URL ('./src/js', import.meta.url)),
      "~/browser": fileURLToPath (new URL ('./src/js/browser', import.meta.url)),
    },
  },
  root: 'src/js/browser',
  server: {
    host: true,
    https: !true,
    port: 3102,
  }
})
