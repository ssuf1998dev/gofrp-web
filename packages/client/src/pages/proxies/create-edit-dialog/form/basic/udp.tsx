import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function UDP() {
  const { t } = useTranslation();

  return (
    <Form.TextField
      name="remotePort"
      label={t("formatting.upper_first", { value: t("server_port") })}
      type="number"
      min={0}
      max={65535}
    />
  );
}

UDP.fields = ["remotePort"];
