import Form from "@/components/form";
import { Flex, RadioGroup } from "@radix-ui/themes";
import IconTablerTransfer from "~icons/tabler/transfer";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function TransportForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<{ _: { transportEnable: boolean } }>();
  const { transportEnable } = values?._ ?? {};

  return (
    <Flex direction="column" gap="3">
      <Form.Switch
        name="_.transportEnable"
        label={t("formatting.upper_first", { value: t("enable") })}
        onCheckedChange={(value) => {
          !value && setFieldValue("transport", undefined);
        }}
      />

      {transportEnable
        ? (
            <>
              <Form.Switch
                name="transport.useEncryption"
                label={t("formatting.upper_first", { value: t("enable_encryption") })}
              />
              <Form.Switch
                name="transport.useCompression"
                label={t("formatting.upper_first", { value: t("enable_compression") })}
              />
              <Form.TextField
                name="transport.bandwidthLimit"
                label={t("formatting.upper_first", { value: t("bandwidth_limit") })}
                type="number"
                units={[{ key: "KiB" }, { key: "MiB" }]}
              />
              <Form.RadioGroup
                name="transport.bandwidthLimitMode"
                label={t("formatting.upper_first", { value: t("bandwidth_limit_mode") })}
                direction="row"
              >
                {[
                  { key: "client", label: t("formatting.upper_first", { value: t("client") }) },
                  { key: "server", label: t("formatting.upper_first", { value: t("server") }) },
                ].map(item => (
                  <RadioGroup.Item key={item.key} value={item.key}>{item.label}</RadioGroup.Item>
                ))}
              </Form.RadioGroup>
              <Form.RadioGroup
                name="transport.proxyProtocolVersion"
                label={t("formatting.upper_first", { value: t("protocol_version") })}
                direction="row"
              >
                {[{ key: "v1" }, { key: "v2" }].map(item => (
                  <RadioGroup.Item key={item.key} value={item.key}>{item.key}</RadioGroup.Item>
                ))}
              </Form.RadioGroup>
            </>
          )
        : <IconTablerTransfer data-accent-color="gray" className=":uno: color-[--accent-3] text-16 mx-a" />}
    </Flex>
  );
}
