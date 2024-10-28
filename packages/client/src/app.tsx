import type { ComponentRef } from "react";

import { Button, DropdownMenu, Flex, Link as RadixLink, TabNav, Text } from "@radix-ui/themes";
import { useDebouncedCallback } from "@react-hookz/web";
import IconTablerLanguage from "~icons/tabler/language";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useMatches, useNavigate } from "react-router-dom";

export default function App() {
  const { t, i18n } = useTranslation();
  const matches = useMatches();
  const currentMatch = useMemo(() => matches.at(-1), [matches]);
  const nav = useNavigate();

  useEffect(() => {
    ["/"].includes(currentMatch?.pathname ?? "/") && nav("proxies", { replace: true });
  }, [currentMatch?.pathname, nav]);

  const [headerElevate, setHeaderElevate] = useState(false);
  const headerRef = useRef<ComponentRef<typeof Flex>>(null);
  const headerEffect = useDebouncedCallback(() => {
    const el = headerRef.current?.parentElement;
    setHeaderElevate(!!el?.scrollTop);
  }, [], 16.7);
  useEffect(() => {
    const el = headerRef.current?.parentElement;
    el?.addEventListener("scroll", headerEffect);
    return () => {
      el?.removeEventListener("scroll", headerEffect);
    };
  }, [headerEffect]);

  return (
    <>
      <Flex
        direction="column"
        className={clsx(
          ":uno: bg-[var(--accent-2)] [&_nav]:(mx-auto w-full min-w-2xl max-w-5xl) pos-sticky top-0 z-1 transition-shadow",
          { ":uno: shadow-[var(--shadow-3)]": headerElevate },
        )}
        ref={headerRef}
      >
        <Flex gap="2" align="center" className=":uno: p-4 pt-6 pb-8 mx-auto w-full min-w-2xl max-w-5xl">
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
        </Flex>

        <TabNav.Root className=":uno: shadow-none px-2">
          {[
            { to: "/proxies", label: t("formatting.capital_case", { value: t("proxy", { count: 2 }) }) },
            { to: "/configurations", label: t("formatting.capital_case", { value: t("configuration", { count: 2 }) }) },
          ].map(item => (
            <TabNav.Link key={item.to} asChild active={currentMatch?.pathname === item.to}>
              <Link to={item.to}>{ item.label }</Link>
            </TabNav.Link>
          ))}
        </TabNav.Root>
      </Flex>

      <div className=":uno: px-4 pt-6 pb-8 mx-auto w-full min-w-2xl max-w-5xl box-border">
        <Outlet />
      </div>
    </>
  );
}
