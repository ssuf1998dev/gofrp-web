import { useLocalStorageValue, useMediaQuery } from "@react-hookz/web";
import { useMemo } from "react";

export default function useDetectThemeAppearance(): ["inherit" | "light" | "dark", typeof $value] {
  const prefersDarkColorScheme = useMediaQuery("(prefers-color-scheme: dark)");
  const $value = useLocalStorageValue<"inherit" | "light" | "dark">("theme");

  const theme = useMemo(() => {
    if ($value.value) {
      return $value.value ?? "inherit";
    }

    return prefersDarkColorScheme ? "dark" : "light";
  }, [$value.value, prefersDarkColorScheme]);

  return [theme, $value];
}
