import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const translateModules = import.meta.glob("./*/*.json", {
  eager: true,
});

const resources = Object.entries(translateModules)
  .map<[string, any]>((entry) => {
    const lng = entry[0].split("/")[1];
    const ns = entry[0].split("/").at(-1)?.split(".")[0] ?? "common";
    return [lng, { [ns]: (entry[1] as any).default }];
  })
  .reduce((map: Record<string, any>, entry) => {
    if (!Object.hasOwn(map, entry[0]))
      map[entry[0]] = {};

    Object.assign(map[entry[0]], entry[1]);
    return map;
  }, {});

// "common" // Things that are reused everywhere, like "Confirm" and "Cancel" on buttons
// "validation" // All validation text, like "email address not valid" in a form
// "glossary" // Words we want to be reused consistently, like key words in your app
void i18n.use(initReactI18next).init({
  resources,
  lng: "en-US",
  defaultNS: "common",
  nsSeparator: ".",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    defaultVariables: {
      what: "",
      key: "",
      src: "",
      tgt: "",
      reason: "",
    },
  },
}).then(() => {
  const { formatter } = i18n.services;
  if (formatter) {
    formatter.add("heading", (value: string, _, options) => {
      return !value ? "" : `${options.char || " "}${value}`;
    });
    formatter.add("tailing", (value: string, _, options) => {
      return !value ? "" : `${value}${options.char || " "}`;
    });
  }
});

export default i18n;
