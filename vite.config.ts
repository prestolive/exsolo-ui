import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

import { viteMockServe } from 'vite-plugin-mock'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const props = {
    plugins: [vue(), eslintPlugin(), svgLoader()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8083/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
  if ('mock' === mode) {
    props.plugins.push(
      viteMockServe({
        mockPath: 'mock',
        localEnabled: true,
      })
    )
  }
  return props
})
