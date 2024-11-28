import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function SUDP() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="secretKey"
        label={t("formatting.upper_first", { value: t("secret_key") })}
        type="password"
      />
      <Form.List
        name="allowUsers"
        label={t("formatting.upper_first", { value: t("allow_users") })}
      />
    </>
  );
}

SUDP.fields = ["secretKey", "allowUsers"];
