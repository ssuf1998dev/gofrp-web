import civet from "@danielx/civet/vite";
import replace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  plugins: [
    civet({
      implicitExtension: false,
      ts: "civet",
    }),
    unocss(),
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            { displayName: true, fileName: false },
          ],
        ],
      },
    }),
    nodePolyfills({
      include: ["path"],
    }),
    icons({
      compiler: "jsx",
      jsx: "react",
      defaultClass: "unplugin-icon",
    }),
    replace({
      "globalThis.process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.NODE_ENV": JSON.stringify(mode),
      "preventAssignment": true,
    }),
  ],
}));