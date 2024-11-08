import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function StaticFile() {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  return (
    <>
      <Form.TextField
        name="plugin.localPath"
        label={t("formatting.upper_first", { value: t("local_path") })}
        required
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.stripPrefix"
        label={t("formatting.upper_first", { value: t("strip_req_path_prefix") })}
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.httpUser"
        label={t("formatting.upper_first", { value: t("http_ba_user") })}
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.httpPassword"
        label={t("formatting.upper_first", { value: t("http_ba_password") })}
        type="password"
        disabled={!pluginEnable}
      />
    </>
  );
}
