import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      solidPlugin({
        // https://github.com/solidjs/solid-refresh/issues/29
        hot: false,
      }),
    ],
    test: {
      watch: false,
      isolate: true,
      env: {
        NODE_ENV: 'development',
      },
      environment: 'jsdom',
      transformMode: { web: [/\.[jt]sx$/] },
      include: ['test/*.test.{ts,tsx}'],
      exclude: ['test/server.test.{ts,tsx}'],
    },
    resolve: {
      conditions: ['browser', 'development'],
    },
  }
})
