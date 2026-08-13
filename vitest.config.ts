import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],

      // Порог считается по слою логики: слайсы, селекторы, хелперы и api.
      // Компоненты и страницы в порог не входят.
      include: [
        'src/api/**/*.ts',
        'src/entities/**/*.ts',
        'src/features/**/*.ts',
        'src/shared/lib/**/*.ts',
        'src/widgets/**/*.ts',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/**/type.ts',
        'src/**/types.ts',
      ],
      thresholds: {
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
