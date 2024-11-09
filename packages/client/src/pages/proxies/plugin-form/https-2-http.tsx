import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function HTTPS2HTTP() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="plugin.localAddr"
        label={t("formatting.upper_first", { value: t("local_addr") })}
        required
      />
      <Form.TextField
        name="plugin.hostHeaderRewrite"
        label={t("formatting.upper_first", { value: t("host_header_rewrite") })}
      />
      <Form.Entries
        name="plugin.requestHeaders"
        label={t("formatting.upper_first", { value: t("request_headers") })}
      />
      <Form.Switch
        name="plugin.enableHTTP2"
        label={t("formatting.upper_first", { value: t("enable_http2") })}
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
