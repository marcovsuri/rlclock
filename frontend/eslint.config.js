import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['dist'],

  files: ['**/*.{ts,tsx}'],

  extends: [
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],

  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.app.json', './tsconfig.node.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
