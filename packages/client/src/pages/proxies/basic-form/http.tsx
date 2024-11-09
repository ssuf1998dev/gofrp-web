import Form from "@/components/form";
import { useTranslation } from "react-i18next";

export default function HTTP() {
  const { t } = useTranslation();

  return (
    <>
      <Form.List
        name="locations"
        label={t("formatting.upper_first", { value: t("routing_conf") })}
      />
      <Form.TextField
        name="httpUser"
        label={t("formatting.upper_first", { value: t("http_ba_user") })}
      />
      <Form.TextField
        name="httpPassword"
        label={t("formatting.upper_first", { value: t("http_ba_password") })}
        type="password"
      />
      <Form.Entries
        name="requestHeaders"
        label={t("formatting.upper_first", { value: t("request_headers") })}
      />
      <Form.Entries
        name="responseHeaders"
        label={t("formatting.upper_first", { value: t("response_headers") })}
      />
      <Form.TextField
        name="routeByHTTPUser"
        label={t("formatting.upper_first", { value: t("route_by_http_ba_user") })}
      />
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

HTTP.fields = ["locations", "httpUser", "httpPassword", "requestHeaders", "responseHeaders", "routeByHTTPUser", "customDomains", "subdomain"];
