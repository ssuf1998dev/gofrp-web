import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function UnixDomainSocket() {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  return (
    <Form.TextField
      name="plugin.unixPath"
      label={t("formatting.upper_first", { value: t("unix_path") })}
      required
      disabled={!pluginEnable}
    />
  );
}
