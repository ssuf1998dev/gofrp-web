import { Button, DropdownMenu, Flex, Grid, Link as RadixLink, TabNav, Text } from "@radix-ui/themes";
import IconTablerLanguage from "~icons/tabler/language";
import IconTablerSunMoon from "~icons/tabler/sun-moon";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useMatches, useNavigate } from "react-router-dom";
import { useHead } from "unhead";

import MainContext from "./contexts/main";

export default function App() {
  const { t, i18n } = useTranslation();
  const matches = useMatches();
  const currentMatch = useMemo(() => matches.at(-1), [matches]);
  const nav = useNavigate();

  useEffect(() => {
    ["/"].includes(currentMatch?.pathname ?? "/") && nav("proxies", { replace: true });
  }, [currentMatch?.pathname, nav]);

  useHead({ title: t("title") });

  return (
    <Grid columns="1" rows="auto minmax(0, 1fr)" className=":uno: h-full">
      <Flex
        direction="column"
        className=":uno: bg-[--accent-2] [&_nav]:(mx-a w-full min-w-2xl max-w-5xl)"
      >
        <Flex gap="2" align="center" className=":uno: p-4 pt-6 pb-8 mx-a w-full min-w-2xl max-w-5xl">
          <Text className=":uno: font-bold text-xl">{t("title")}</Text>
          <span className=":uno: flex-grow-1" />
          <RadixLink size="2" href={t("documentation_url")} target="_blank" rel="noopener,noreferrer">
            {t("formatting.capital_case", { value: t("documentation") })}
          </RadixLink>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size="2" variant="ghost" className="m-0"><IconTablerLanguage /></Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {(i18n.options.supportedLngs as string[]).map(item => (
                <DropdownMenu.CheckboxItem
                  key={item}
                  onClick={() => { i18n.changeLanguage(item); }}
                  checked={i18n.language === item}
                >
                  {t(`languages.${item}`)}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <MainContext.Consumer>
            {({ themeAppearance, setThemeAppearance }) => (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button size="2" variant="ghost" className="m-0"><IconTablerSunMoon /></Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {["light", "dark", "inherit"].map(item => (
                    <DropdownMenu.CheckboxItem
                      key={item}
                      onClick={() => { setThemeAppearance?.(item as any); }}
                      checked={item === themeAppearance}
                    >
                      {t("formatting.upper_first", { value: t(`theme_${item}`) })}
                    </DropdownMenu.CheckboxItem>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </MainContext.Consumer>
        </Flex>

        <TabNav.Root className=":uno: shadow-none px-2">
          {[
            { to: "/proxies", label: t("formatting.capital_case", { value: t("proxy", { count: 2 }) }) },
            { to: "/configurations", label: t("formatting.capital_case", { value: t("configuration", { count: 2 }) }) },
          ].map(item => (
            <TabNav.Link key={item.to} asChild active={currentMatch?.pathname === item.to}>
              <Link to={item.to}>{item.label}</Link>
            </TabNav.Link>
          ))}
        </TabNav.Root>
      </Flex>

      <Outlet />
    </Grid>
  );
}
