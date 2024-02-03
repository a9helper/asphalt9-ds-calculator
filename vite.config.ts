import { fileURLToPath, URL } from 'node:url'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import { visualizer } from 'rollup-plugin-visualizer'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 4897,
    proxy: {
      '/api': {
        target: 'https://387dda42-7df7-43c7-ab80-535cd9986d16.bspapp.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    // vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [VarletUIResolver({ autoImport: true })],
      dts: 'src/auto-import.d.ts',
    }),
    Components({
      resolvers: [VarletUIResolver()],
      dts: 'src/components.d.ts',
    }),
    //keep visualizer to the last one
    // visualizer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
