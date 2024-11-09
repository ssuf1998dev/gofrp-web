import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function HTTPProxy() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="plugin.httpUser"
        label={t("formatting.upper_first", { value: t("proxy_user") })}
      />
      <Form.TextField
        name="plugin.httpPassword"
        label={t("formatting.upper_first", { value: t("proxy_password") })}
        type="password"
      />
    </>
  );
}
