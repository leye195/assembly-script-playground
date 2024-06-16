module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "assembly"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ["assembly/**"],
      parserOptions: {
        project: "assembly/tsconfig.json",
      },
      rules: {
        // Type conversions require an explicit cast in AssemblyScript.
        "@typescript-eslint/no-unnecessary-type-assertion": "off",

        // Different behavior in AssemblyScript.
        // https://www.assemblyscript.org/basics.html#triple-equals
        eqeqeq: "off",
      },
    },
  ],
};
