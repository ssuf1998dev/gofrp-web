import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function HTTP2HTTPS() {
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
      <Form.Switch
        name="plugin.enableHTTP2"
        label={t("formatting.upper_first", { value: t("enable_http2") })}
      />
    </>
  );
}
