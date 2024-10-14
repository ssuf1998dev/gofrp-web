import { ConfigProvider } from "antd";
import "normalize.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "uno.css";

import "./locales";
import router from "./router";
import * as theme from "./theme";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={theme.light}>
    <RouterProvider router={router}></RouterProvider>
  </ConfigProvider>,
);
