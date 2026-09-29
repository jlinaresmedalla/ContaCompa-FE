import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { project: ['./tsconfig.app.json'], tsconfigRootDir: import.meta.dirname },
    },
  },
  prettier,
)
