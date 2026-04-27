import { defineConfig } from 'vite';
import { resolve } from 'path';

const base = process.env.BASE_URL || '/./';

export default defineConfig({
  base,
  root: '.',
  publicDir: false,
  build: {
    outDir: '../dist/platform-game',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
