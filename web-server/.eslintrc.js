// module.exports = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: 'tsconfig.json',
//     sourceType: 'module',
//   },
//   plugins: ['@typescript-eslint/eslint-plugin'],
//   extends: [
//     'plugin:@typescript-eslint/eslint-recommended',
//     'plugin:@typescript-eslint/recommended',
//     'prettier',
//     'prettier/@typescript-eslint',
//   ],
//   root: true,
//   env: {
//     node: true,
//     jest: true,
//   },
//   rules: {
//     '@typescript-eslint/interface-name-prefix': 'off',
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     "semi": ["error", "always"],
//   },
// };

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    // "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-empty-function": 0,
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "semi": ["error", "always"],
    "no-unused-vars": [
      1,
      {
        "vars": "all",
        "args": "none",
        "ignoreRestSiblings": false
      }
    ],
    "linebreak-style": 0,
    "import/prefer-default-export": 0,
    "no-underscore-dangle": 0,
    "no-console": 0,
    "arrow-body-style": 0,
    "no-return-assign": 0,
    "import/extensions": 0,
    "no-case-declarations": 0,
    "no-param-reassign": 0, // 禁止给参数重新赋值
    "no-plusplus": 0,
    "prefer-object-spread": 0,
    "guard-for-in": 0,
    "comma-dangle": 0,
    "quotes": 0,
    "class-methods-use-this": 0,
    "no-restricted-syntax": 0,
    "no-return-await": 0,
    "import/no-unresolved": 0,
    "max-classes-per-file": 0,
    "object-curly-spacing": ["error", "always"],
    'import/no-extraneous-dependencies': [
      1,
      { devDependencies: ['**/*spec.ts'] },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
  },
  settings: {
    "import/resolver": {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
  }
};