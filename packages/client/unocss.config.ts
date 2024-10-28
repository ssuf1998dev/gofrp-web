import { defineConfig, presetUno, transformerCompileClass, transformerVariantGroup } from "unocss";

export default defineConfig({
  transformers: [
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
  presets: [
    presetUno(),
  ],
  rules: [
    ["content-fine-empty", { content: "\"--\"" }],
  ],
});
