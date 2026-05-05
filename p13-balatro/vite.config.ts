import { defineConfig } from 'vite';
import { resolve } from 'path';

const base = process.env.BASE_URL || '/./';

export default defineConfig({
  base,
  root: '.',
  publicDir: './public',
  build: {
    outDir: 'dist',
    assetsDir: 'public',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
