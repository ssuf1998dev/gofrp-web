import type { ThemeConfig } from "antd";

export const light = {
  cssVar: true,
  token: {
    // #16423C
    colorPrimary: "#6A9C89",
    borderRadius: 4,
  },
  components: {
    Layout: {
      bodyBg: "white",
      headerBg: "var(--ant-color-bg-layout)",
    },
  },
} satisfies ThemeConfig;
