import { Flex } from "@radix-ui/themes";
import { useMountEffect } from "@react-hookz/web";
import IconTablerUfo from "~icons/tabler/ufo";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TableEmpty() {
  const { t } = useTranslation();
  const selfRef = useRef<HTMLTableCellElement>(null);
  const [colSpan, setColSpan] = useState(99);

  useMountEffect(() => {
    const thead = selfRef.current?.closest("table")?.getElementsByTagName("thead")[0];
    thead && setColSpan(thead.getElementsByTagName("th").length);
  });

  return (
    <tr>
      <td ref={selfRef} className=":uno: py-8 w-full color-[--gray-indicator]" colSpan={colSpan}>
        <Flex direction="column" justify="center" align="center" gap="1">
          <IconTablerUfo className=":uno: text-3xl" />
          <span>{t("formatting.capital_case", { value: t("empty") })}</span>
        </Flex>
      </td>
    </tr>
  );
}
