import { defineConfig, presetUno, transformerCompileClass, transformerVariantGroup } from "unocss";

export default defineConfig({
  transformers: [
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
  presets: [
    presetUno(),
  ],
  theme: {
    animation: {
      keyframes: { ufo: "{0%, 100% {transform:translateY(0) rotate(3deg);opacity:0.67} 50% {transform:translateY(10%);opacity:1}}" },
      counts: { ufo: "infinite" },
      durations: { ufo: "3s" },
    },
  },
});
