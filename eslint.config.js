import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      semi: true,
      quotes: "double",
    },
    formatters: true,
    rules: {
      "ts/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "perfectionist/sort-imports": ["error", { newlinesBetween: "always" }],
      "eslint-comments/no-unlimited-disable": "off",
    },
  },
  {
    ignores: ["packages/**"],
  },
);
