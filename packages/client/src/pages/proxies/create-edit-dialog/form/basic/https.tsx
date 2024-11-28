import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function HTTPS() {
  const { t } = useTranslation();

  return (
    <>
      <Form.List
        name="customDomains"
        label={t("formatting.upper_first", { value: t("custom_domain") })}
      />
      <Form.TextField
        name="subdomain"
        label={t("formatting.upper_first", { value: t("subdomain") })}
      />
    </>
  );
}

HTTPS.fields = ["customDomains", "subdomain"];
