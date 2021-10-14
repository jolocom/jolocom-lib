// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [ "@rushstack/eslint-config/profile/node" ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    // Avoid Promise based foot-shooting
    //'@typescript-eslint/promise-function-async': ['error'],
    '@typescript-eslint/no-floating-promises': ['error'],
    '@typescript-eslint/no-misused-promises': ['error'],

    // TODO: remove these after fixing stuff
    '@typescript-eslint/no-use-before-define': ['warn'],
    '@typescript-eslint/promise-function-async': ['warn'],
    'require-atomic-updates': ['warn']
  },
};
