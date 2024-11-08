import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function TLS2Raw() {
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
        name="plugin.crtPath"
        label={t("formatting.upper_first", { value: t("crt_path") })}
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.keyPath"
        label={t("formatting.upper_first", { value: t("key_path") })}
        disabled={!pluginEnable}
      />
    </>
  );
}
