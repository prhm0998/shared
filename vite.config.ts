import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'utils/index': path.resolve(__dirname, 'src/utils/index.ts'),
        'composables/index': path.resolve(__dirname, 'src/composables/index.ts')
      },
      name: 'shared',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
      external: ['vue', 'vite'], // 外部依存があれば追加
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,       // 開発時は false の方が確認しやすい
    target: 'esnext',
    sourcemap: true,
  },
})
