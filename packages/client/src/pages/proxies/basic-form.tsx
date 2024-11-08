import Form from "@/components/form";
import { Flex, Select } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function BasicForm() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="3">
      <Form.TextField
        name="name"
        label={t("formatting.upper_first", { value: t("name") })}
        required
      />
      <Form.Select
        name="type"
        label={t("formatting.upper_first", { value: t("type") })}
        required
      >
        {["tcp", "udp", "http", " https", "tcpmux", " stcp", "sudp", "xtcp"].map(item => (
          <Select.Item key={item} value={item}>
            {item.toUpperCase()}
          </Select.Item>
        ))}
      </Form.Select>
      <Form.TextField
        name="localIP"
        label={t("formatting.upper_first", { value: t("local_ip") })}
      />
      <Form.TextField
        name="localPort"
        label={t("formatting.upper_first", { value: t("local_port") })}
        type="number"
        min={0}
        max={65535}
      />
      <Form.Entries
        name="annotations"
        label={t("formatting.upper_first", { value: t("annotations") })}
        tooltip={t("help.annotations")}
      />
      <Form.Entries
        name="metadatas"
        label={t("formatting.upper_first", { value: t("metadata") })}
        tooltip={t("help.metadata")}
      />
    </Flex>
  );
}
