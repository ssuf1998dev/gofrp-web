import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "normalize.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "uno.css";

import "./locales";
import mocks from "./mocks";
import router from "./router";
import "./theme.css";

mocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <Theme accentColor="teal" className=":uno: overflow-hidden min-w-2xl min-h-unset h-full">
      <RouterProvider router={router} />
    </Theme>,
  );
});
