import Form from "@/components/form";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function Socks5() {
  const { t } = useTranslation();
  const { values } = useFormikContext<{ _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  return (
    <>
      <Form.TextField
        name="plugin.username"
        label={t("formatting.upper_first", { value: t("username") })}
        disabled={!pluginEnable}
      />
      <Form.TextField
        name="plugin.password"
        label={t("formatting.upper_first", { value: t("password") })}
        type="password"
        disabled={!pluginEnable}
      />
    </>
  );
}
