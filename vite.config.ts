import path, { resolve } from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'composables/index': path.resolve(__dirname, 'src/composables/index.ts'),
        'utils/index': path.resolve(__dirname, 'src/utils/index.ts'),
        'pinia/index': path.resolve(__dirname, 'src/pinia/index.ts'),
      },
      name: 'shared',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
      external: ['vue', 'vite', 'pinia'], // 外部依存があれば追加
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,       // 開発時は false の方が確認しやすい
    target: 'esnext',
    sourcemap: true,
  },
  plugins: [dts({ insertTypesEntry: true, tsconfigPath: resolve(__dirname, 'tsconfig.app.json') })],
})
