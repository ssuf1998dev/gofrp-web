import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import consola from "consola";
import "normalize.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createHead } from "unhead";
import "uno.css";

import "./locales";
import mocks from "./mocks";
import router from "./router";
import "./theme.css";
import "./styles.css";

createHead();

process.env.NODE_ENV === "development" && (consola.level = Infinity);

mocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <Theme accentColor={"custom" as any} className=":uno: min-w-2xl min-h-unset h-full">
      <RouterProvider router={router} />
    </Theme>,
  );
});
