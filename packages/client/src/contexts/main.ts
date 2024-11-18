import { createContext } from "react";

const MainContext = createContext<Partial<{
  themeAppearance: "inherit" | "light" | "dark";
  setThemeAppearance: (value: "inherit" | "light" | "dark") => void;
}>>({
      themeAppearance: "inherit",
    });

export default MainContext;
