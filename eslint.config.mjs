import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        Cypress: 'readonly',
        cy: 'readonly',
        process: true,
        describe: 'readonly',
        it: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  },
];