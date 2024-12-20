import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function TLS2Raw() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="plugin.localAddr"
        label={t("formatting.upper_first", { value: t("local_addr") })}
        required
      />
      <Form.TextField
        name="plugin.crtPath"
        label={t("formatting.upper_first", { value: t("crt_path") })}
      />
      <Form.TextField
        name="plugin.keyPath"
        label={t("formatting.upper_first", { value: t("key_path") })}
      />
    </>
  );
}
