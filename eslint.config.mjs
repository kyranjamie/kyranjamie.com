import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/', '.astro/', '.wrangler/', '.pnpm-store/']),
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts,astro}'],
    extends: [tseslint.configs.recommended],
  },
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    files: ['*.{js,mjs,cjs}', '**/*.astro'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['src/**/*.{js,ts}', '**/*.astro/*.{js,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettier,
])
