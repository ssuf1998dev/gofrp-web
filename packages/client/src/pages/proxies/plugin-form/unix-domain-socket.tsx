import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function UnixDomainSocket() {
  const { t } = useTranslation();

  return (
    <Form.TextField
      name="plugin.unixPath"
      label={t("formatting.upper_first", { value: t("unix_path") })}
      required
    />
  );
}
