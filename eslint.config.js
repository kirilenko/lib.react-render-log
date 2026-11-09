import { defineConfig } from 'eslint/config'
import eslintConfigK8 from 'eslint-config-k8'

export default defineConfig([
  { ignores: ['**/dist/**', '**/coverage/**'] },
  { extends: [eslintConfigK8] },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // `<Context>` as a provider requires React 19, but the library supports React 18
      '@eslint-react/no-context-provider': 'off',
    },
  },
])
