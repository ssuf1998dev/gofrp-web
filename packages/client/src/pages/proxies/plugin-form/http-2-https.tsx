import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function HTTP2HTTPS() {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  return (
    <>
      <Form.TextField
        name="plugin.localAddr"
        label={t("formatting.upper_first", { value: t("local_addr") })}
        required
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.hostHeaderRewrite"
        label={t("formatting.upper_first", { value: t("host_header_rewrite") })}
        disabled={!pluginEnable}
      />
      <Form.Entries
        name="plugin.requestHeaders"
        label={t("formatting.upper_first", { value: t("request_headers") })}
        disabled={!pluginEnable}
      />
    </>
  );
}
