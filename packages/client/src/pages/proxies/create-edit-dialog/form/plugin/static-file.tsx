import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function StaticFile() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="plugin.localPath"
        label={t("formatting.upper_first", { value: t("local_path") })}
        required
      />
      <Form.TextField
        name="plugin.stripPrefix"
        label={t("formatting.upper_first", { value: t("strip_req_path_prefix") })}
      />
      <Form.TextField
        name="plugin.httpUser"
        label={t("formatting.upper_first", { value: t("http_ba_user") })}
      />
      <Form.TextField
        name="plugin.httpPassword"
        label={t("formatting.upper_first", { value: t("http_ba_password") })}
        type="password"
      />
    </>
  );
}
