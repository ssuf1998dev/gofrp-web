import type { ProxySchemaType } from "@/apis/schema";

import Form from "@/components/form";
import { Flex, Select } from "@radix-ui/themes";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import HTTPS2HTTP from "./https-2-http";

export default function PluginForm() {
  const { t } = useTranslation();
  const { values } = useFormikContext<ProxySchemaType>();

  const plugin = useMemo(() => {
    return ({
      https2http: <HTTPS2HTTP />,
    } as any)[values.plugin?.type ?? ""];
  }, [values.plugin?.type]);

  return (
    <Flex direction="column" gap="3">
      <Form.Select
        name="plugin.type"
        label={t("formatting.upper_first", { value: t("type") })}
        trigger={{ className: ":uno: min-w-52" }}
      >
        {[{ key: "https2http", label: "HTTPS2HTTP" }].map(({ key, label }) => (
          <Select.Item key={key} value={key}>{label}</Select.Item>
        ))}
      </Form.Select>

      {plugin}
    </Flex>
  );
}
