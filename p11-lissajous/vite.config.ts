import { defineConfig } from 'vite';
import { resolve } from 'path';

const base = process.env.BASE_URL || '/p11-lissajous/';

export default defineConfig({
  base,
  root: '.',
  publicDir: 'public',
  build: {
    outDir: '../dist/p11-lissajous',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
