import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        myCustomGlobal: "readonly",
      },
    },
    ignores: ["build", "coverage", "node_modules", "dist", "public", ".git/"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
