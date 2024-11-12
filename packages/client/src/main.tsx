import type { ContextType } from "react";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import consola from "consola";
import "normalize.css";
import { createContext, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createHead } from "unhead";
import "uno.css";

import Toast from "./components/toast";
import useDetectThemeAppearance from "./hooks/use-detect-theme-appearance";
import "./locales";
import mocks from "./mocks";
import router from "./router";
import "./styles.css";
import "./theme.css";

createHead();

process.env.NODE_ENV === "development" && (consola.level = Infinity);

export const MainContext = createContext<Partial<{
  themeAppearance: "inherit" | "light" | "dark";
  setThemeAppearance: (value: "inherit" | "light" | "dark") => void;
}>>({
      themeAppearance: "inherit",
    });

function Main() {
  const [themeAppearance, $themeAppearance] = useDetectThemeAppearance();
  const mainContextProviderValue = useMemo<ContextType<typeof MainContext>>(() => ({
    themeAppearance,
    setThemeAppearance: (value) => {
      $themeAppearance.set(value);
    },
  }), [$themeAppearance, themeAppearance]);

  return (
    <MainContext.Provider value={mainContextProviderValue}>
      <Theme accentColor={"custom" as any} appearance={themeAppearance} className=":uno: min-w-2xl min-h-unset h-full">
        <RouterProvider router={router} />
        <Toast />
      </Theme>
    </MainContext.Provider>
  );
}

mocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <Main />,
  );
});
