import eslint from '@eslint/js';
import pluginImport from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: ['**/lib'],
  },
  {
    plugins: {
      'import-x': pluginImport,
    },
    rules: {
      'import-x/order': [
        'warn',
        {
          /** @type {NonNullable<import('eslint-plugin-import-x')['rules']['order']['defaultOptions']['0']>['groups']} */
          groups: [
            'external',
            'internal',
            'builtin',

            'parent',
            'sibling',
            'index',

            'type',
            'object',
          ],
          /** @type {NonNullable<import('eslint-plugin-import-x')['rules']['order']['defaultOptions']['0']>['newlines-between']} */
          'newlines-between': 'always',
          /** @type {NonNullable<import('eslint-plugin-import-x')['rules']['order']['defaultOptions']['0']>['alphabetize']} */
          alphabetize: { order: 'asc' },
        },
      ],
      'import-x/newline-after-import': 'warn',
    },
  },
);
