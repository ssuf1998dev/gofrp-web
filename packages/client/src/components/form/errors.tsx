import type { ZodIssue } from "zod";

import { Text } from "@radix-ui/themes";
import { useField } from "formik";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function FormErrors(props: { name: string; label?: string }) {
  const { t } = useTranslation();
  const { name, label } = props;
  const [field, meta] = useField<string[][]>(name);

  const gotError = meta.error?.length && meta.touched;

  const formatError = useCallback((error: ZodIssue) => {
    if (error.message === "Required"
      || (error.code === "too_small" && error.type === "string")
      || (error.code === "invalid_enum_value" && !error.received)) {
      return t("formatting.sentence_case", { value: t("errors.required", { label: label ?? field.name }) });
    }

    if (error.code === "too_big" && error.type === "number") {
      return t("formatting.sentence_case", { value: t("errors.lte", { max: error.maximum }) });
    }

    if (error.code === "too_small" && error.type === "number") {
      return t("formatting.sentence_case", { value: t("errors.gte", { min: error.minimum }) });
    }

    if (error.code === "invalid_string" && error.validation === "ip") {
      return t("formatting.upper_first", { value: t("errors.invalid_ip") });
    }

    if (error.code === "invalid_string" && error.validation === "url") {
      return t("formatting.upper_first", { value: t("errors.invalid_url") });
    }

    return error.message;
  }, [field.name, label, t]);

  if (!gotError) {
    return null;
  }

  return (
    <Text size="1" color="red" className=":uno: block mt-1">
      {([meta.error].flat().filter(Boolean) as unknown as ZodIssue[])
        .map((item, idx) => {
          const formatted = formatError(item);
          return !idx ? formatted : t("formatting.lower_first", { value: formatted });
        })
        .join(t("chinese_serial_comma"))}
    </Text>
  );
}
