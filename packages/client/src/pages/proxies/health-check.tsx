import Form from "@/components/form";
import { Flex, Select } from "@radix-ui/themes";
import IconTablerHeartCheck from "~icons/tabler/heart-check";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function HealthCheckForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<{ _: { healthCheckEnable: boolean } }>();
  const { healthCheckEnable } = values?._ ?? {};

  return (
    <Flex direction="column" gap="3">
      <Form.Switch
        name="_.healthCheckEnable"
        label={t("formatting.upper_first", { value: t("enable") })}
        onCheckedChange={(value) => {
          !value && setFieldValue("healthCheck", undefined);
        }}
      />

      {healthCheckEnable
        ? (
            <>
              <Form.Select
                name="healthCheck.type"
                label={t("formatting.upper_first", { value: t("type") })}
                required
              >
                {["tcp", "http"].map(item => (
                  <Select.Item key={item} value={item}>
                    {item.toUpperCase()}
                  </Select.Item>
                ))}
              </Form.Select>
              <Form.TextField
                name="healthCheck.timeoutSeconds"
                label={t("formatting.upper_first", { value: t("timeout_seconds") })}
                type="number"
              />
              <Form.TextField
                name="healthCheck.maxFailed"
                label={t("formatting.upper_first", { value: t("max_failed") })}
                type="number"
              />
              <Form.TextField
                name="healthCheck.intervalSeconds"
                label={t("formatting.upper_first", { value: t("check_interval_seconds") })}
                type="number"
              />
              <Form.TextField
                name="healthCheck.path"
                label={t("formatting.upper_first", { value: t("interface_address") })}
              />
              <Form.Entries
                name="healthCheck.httpHeaders"
                label={t("formatting.upper_first", { value: t("request_headers") })}
              />
            </>
          )
        : <IconTablerHeartCheck data-accent-color="gray" className=":uno: color-[--accent-3] text-16 mx-a" />}
    </Flex>
  );
}
