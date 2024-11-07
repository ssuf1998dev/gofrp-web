import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function Socks5() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="plugin.username"
        label={t("formatting.upper_first", { value: t("username") })}
      />
      <Form.TextField
        name="plugin.password"
        label={t("formatting.upper_first", { value: t("password") })}
        type="password"
      />
    </>
  );
}
