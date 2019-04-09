module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    // allows imports
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // turn on eslint-plugin-prettier and eslint-config-prettier
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Prefer named exports',
      },
    ],
    '@typescript-eslint/array-type': ['error', 'array-simple'],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: 'Use {} instead.',
          String: "Use 'string' instead.",
          Number: "Use 'number' instead.",
          Boolean: "Use 'boolean' instead.",
        },
      },
    ],
    // PascalCase for classes
    '@typescript-eslint/class-name-casing': ['error'],
    // allow 'I' prefix to interface names
    '@typescript-eslint/interface-name-prefix': ['off'],
    '@typescript-eslint/no-inferrable-types': ['error'],
    // namespaces and modules are outdated, use ES6 style
    '@typescript-eslint/no-namespace': ['error'],
    // use ES6-style imports instead
    '@typescript-eslint/no-triple-slash-reference': ['error'],
  },
}
