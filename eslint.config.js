import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Spec 006 (ADR 0028 / 0030): each level imports only lower levels, never features,
// never the legacy shared roots and never its own barrel (same-level files use paths).
const COMPONENT_LEVELS = ['atoms', 'molecules', 'organisms', 'templates']
const LEGACY_COMPONENT_ROOTS = ['ui', 'layout', 'brand', 'loading']

function levelImportRule(level, files, blockSiblings) {
  const upper = COMPONENT_LEVELS.slice(COMPONENT_LEVELS.indexOf(level) + 1)
  return {
    files,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features',
                '@/features/**',
                '**/features/**',
                `@/components/${level}`,
                ...upper.flatMap((restricted) => [
                  `@/components/${restricted}`,
                  `@/components/${restricted}/**`,
                  `**/${restricted}`,
                  `**/${restricted}/**`,
                ]),
                ...(blockSiblings
                  ? [
                      ...(blockSiblings === 'folder' ? [] : ['./*']),
                      '../*',
                      '@/components/atoms/**',
                      '**/atoms/**',
                    ]
                  : []),
                ...LEGACY_COMPONENT_ROOTS.flatMap((legacy) => [
                  `@/components/${legacy}`,
                  `@/components/${legacy}/**`,
                  `**/${legacy}/**`,
                ]),
              ],
              message:
                'Shared components import only lower levels (through their barrel) and never features; same-level files import by path, atoms import no project component. Use lib for non-component utilities.',
            },
          ],
        },
      ],
    },
  }
}

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

// Spec 008 / ADR 0032: report naming drift while files migrate in batches.
const LOCAL_PLUGIN = {
  rules: {
    'file-name': {
      meta: {
        type: 'suggestion',
        schema: [],
        messages: { case: 'File "{{file}}" must use {{expected}} naming.' },
      },
      create(context) {
        return {
          'Program:exit'(node) {
            const filename = context.filename.replaceAll('\\', '/')
            const file = filename.split('/').at(-1)
            if (
              file === 'index.ts' ||
              file === 'main.tsx' ||
              filename.endsWith('/src/test/setup.ts') ||
              file.endsWith('.d.ts')
            )
              return
            const base = file.split('.')[0]
            const isPascalBinding = (name) => /^[A-Z]/.test(name) && /[a-z]/.test(name)
            const bindingNames = (binding) => {
              if (!binding) return []
              if (binding.type === 'Identifier') return [binding.name]
              if (binding.type === 'RestElement') return bindingNames(binding.argument)
              if (binding.type === 'AssignmentPattern') return bindingNames(binding.left)
              if (binding.type === 'ArrayPattern') return binding.elements.flatMap(bindingNames)
              if (binding.type === 'ObjectPattern')
                return binding.properties.flatMap((property) =>
                  bindingNames(
                    property.type === 'RestElement' ? property.argument : property.value,
                  ),
                )
              return []
            }
            const typeBindings = new Set()
            for (const statement of node.body) {
              const declaration = statement.declaration ?? statement
              if (['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'].includes(declaration.type))
                typeBindings.add(declaration.id.name)
            }
            const hasPascalExport = node.body.some((statement) => {
              if (statement.type === 'ExportDefaultDeclaration') {
                const declaration = statement.declaration
                if (
                  ['FunctionDeclaration', 'ClassDeclaration', 'Identifier'].includes(
                    declaration.type,
                  )
                )
                  return bindingNames(declaration.id ?? declaration).some(isPascalBinding)
                return false
              }
              if (statement.type !== 'ExportNamedDeclaration' || statement.exportKind === 'type')
                return false
              const declaration = statement.declaration
              if (declaration?.type === 'VariableDeclaration')
                return declaration.declarations
                  .flatMap((item) => bindingNames(item.id))
                  .some(isPascalBinding)
              if (['FunctionDeclaration', 'ClassDeclaration'].includes(declaration?.type))
                return bindingNames(declaration.id).some(isPascalBinding)
              return statement.specifiers.some((specifier) => {
                if (specifier.exportKind === 'type') return false
                if (!statement.source && typeBindings.has(specifier.local?.name)) return false
                return isPascalBinding(specifier.exported.name ?? specifier.exported.value)
              })
            })
            const hook = /^use(?:[A-Z]|-)/.test(base)
            const test = /\.test\.[^.]+$/.test(file)
            const pattern = hook
              ? /^use[A-Z][A-Za-z0-9]*$/
              : test
                ? /^(?:[A-Z][A-Za-z0-9]*|[a-z][A-Za-z0-9]*)$/
                : hasPascalExport
                  ? /^[A-Z][A-Za-z0-9]*$/
                  : /^[a-z][A-Za-z0-9]*$/
            const expected = hook
              ? 'useCamelCase'
              : test
                ? 'PascalCase, camelCase or useCamelCase'
                : hasPascalExport
                  ? 'PascalCase'
                  : 'camelCase'
            if (!pattern.test(base))
              context.report({ node, messageId: 'case', data: { file, expected } })
          },
        }
      },
    },
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
    plugins: { local: LOCAL_PLUGIN },
    rules: {
      'local/file-name': 'warn',
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
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: LEGACY_COMPONENT_ROOTS.flatMap((legacy) => [
            `@/components/${legacy}`,
            `@/components/${legacy}/**`,
            `**/components/${legacy}`,
            `**/components/${legacy}/**`,
          ]),
        },
      ],
    },
  },
  ...COMPONENT_LEVELS.flatMap((level) => [
    levelImportRule(level, [`src/components/${level}/**/*.{ts,tsx}`], level === 'atoms'),
    // Atom companions may import ./ paths; parent and other-atom imports stay blocked.
    ...(level === 'atoms'
      ? [levelImportRule(level, ['src/components/atoms/*/**/*.{ts,tsx}'], 'folder')]
      : []),
    // The barrel re-exports its atoms and a test imports the atom beside it.
    ...(level === 'atoms'
      ? [
          levelImportRule(
            level,
            ['src/components/atoms/index.ts', 'src/components/atoms/**/*.test.{ts,tsx}'],
            false,
          ),
        ]
      : []),
  ]),
  prettier,
)
