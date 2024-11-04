import { Select } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function SelectItemWhenEmpty() {
  const { t } = useTranslation();
  return (
    <Select.Item
      value="<empty>"
      className=":uno: pointer-events-none bg-[unset]! color-[--gray-a8] [&_.rt-SelectItemIndicator]:opacity-0"
    >
      {t("formatting.capital_case", { value: t("empty") })}
    </Select.Item>
  );
}
