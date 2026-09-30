import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// The upstream rule does not recognize numeric members of `as const` dictionaries.
// Preserve its checks and add the explicit ADR 0026 exception only for literal members.
const NO_MAGIC_NUMBERS = tseslint.plugin.rules['no-magic-numbers']
tseslint.plugin.rules['no-magic-numbers'] = {
  ...NO_MAGIC_NUMBERS,
  create(context) {
    const listeners = NO_MAGIC_NUMBERS.create(context)
    return {
      ...listeners,
      Literal(node) {
        let member = node
        if (member.parent.type === 'UnaryExpression') member = member.parent
        while (
          member.parent.type === 'Property' ||
          member.parent.type === 'ObjectExpression' ||
          member.parent.type === 'ArrayExpression'
        ) {
          member = member.parent
        }
        const assertion = member.parent
        if (
          assertion.type === 'TSAsExpression' &&
          assertion.typeAnnotation.type === 'TSTypeReference' &&
          assertion.typeAnnotation.typeName.type === 'Identifier' &&
          assertion.typeAnnotation.typeName.name === 'const'
        )
          return
        listeners.Literal(node)
      },
    }
  },
}

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
    rules: {
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          detectObjects: true,
          enforceConst: true,
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreTypeIndexes: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          types: ['function'],
          format: null,
        },
      ],
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { project: ['./tsconfig.app.json'], tsconfigRootDir: import.meta.dirname },
    },
  },
  prettier,
)
