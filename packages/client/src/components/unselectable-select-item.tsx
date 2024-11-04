import { Select } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function UnselectableSelectItem() {
  const { t } = useTranslation();
  return (
    <Select.Item
      value="<unselect>"
      className=":uno: not-[[data-highlighted]]:color-[--gray-a8] [&_.rt-SelectItemIndicator]:opacity-0"
    >
      {t("formatting.capital_case", { value: t("unselect") })}
    </Select.Item>
  );
}
