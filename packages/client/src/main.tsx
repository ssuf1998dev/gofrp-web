import { ConfigProvider } from "antd";
import "normalize.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "uno.css";

import "./locales";
import mocks from "./mocks/index.civet";
import router from "./router";
import * as theme from "./theme";

mocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <ConfigProvider theme={theme.light}>
      <RouterProvider router={router}></RouterProvider>
    </ConfigProvider>,
  );
});
