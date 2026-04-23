import { defineConfig } from 'vite';
import { resolve } from 'path';

const base = process.env.BASE_URL || '/p09-funciones/';

export default defineConfig({
  base,
  root: '.',
  publicDir: 'public',
  build: {
    outDir: '../dist/p09-funciones',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
