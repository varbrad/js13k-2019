module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: ["src/**/*.js"],
      env: {
        node: false,
        browser: true,
      }
    }
  ]
}
