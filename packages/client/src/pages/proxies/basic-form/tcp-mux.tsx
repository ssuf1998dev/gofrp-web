import Form from "@/components/form";
import { Select } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function TCPMux() {
  const { t } = useTranslation();

  return (
    <>
      <Form.TextField
        name="httpUser"
        label={t("formatting.upper_first", { value: t("http_ba_user") })}
      />
      <Form.TextField
        name="httpPassword"
        label={t("formatting.upper_first", { value: t("http_ba_password") })}
        type="password"
      />
      <Form.TextField
        name="routeByHTTPUser"
        label={t("formatting.upper_first", { value: t("route_by_http_ba_user") })}
      />
      <Form.Select
        name="multiplexer"
        label={t("formatting.upper_first", { value: t("multiplexer") })}
      >
        {["httpconnect"].map(item => (
          <Select.Item key={item} value={item}>{item}</Select.Item>
        ))}
      </Form.Select>
    </>
  );
}

TCPMux.fields = ["httpUser", "httpPassword", "routeByHTTPUser", "multiplexer"];
