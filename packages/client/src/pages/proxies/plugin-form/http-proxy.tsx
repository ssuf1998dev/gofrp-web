import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function HTTPProxy() {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  return (
    <>
      <Form.TextField
        name="plugin.httpUser"
        label={t("formatting.upper_first", { value: t("proxy_user") })}
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.httpPassword"
        label={t("formatting.upper_first", { value: t("proxy_password") })}
        type="password"
        disabled={!pluginEnable}
      />
    </>
  );
}
