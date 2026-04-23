import { defineConfig } from 'vite';
import { resolve } from 'path';

const base = process.env.BASE_URL || '/p10-proyectiles/';

export default defineConfig({
  base,
  root: '.',
  publicDir: 'public',
  build: {
    outDir: '../dist/p10-proyectiles',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
