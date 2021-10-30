module.exports = {
    parserOptions: {
        "project": "./tsconfig.json",
        "tsconfigRootDir": __dirname,
        "sourceType": "module"
    },
    rules: {
      "no-console": "off",
      "no-case-declarations": "off",
      "no-await-in-loop": "off",
      "import/prefer-default-export": "off",
      "no-underscore-dangle" : "off",
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: "airbnb-base-typescript-prettier"
  };
  