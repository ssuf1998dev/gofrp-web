import type { ProxySchemaType } from "@/apis/schema";

import Form from "@/components/form";
import { Flex, Select } from "@radix-ui/themes";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import HTTP2HTTPS from "./http-2-https";
import HTTPProxy from "./http-proxy";
import HTTPS2HTTP from "./https-2-http";
import HTTPS2HTTPS from "./https-2-https";
import Socks5 from "./socks5";
import StaticFile from "./static-file";
import TLS2Raw from "./tls-2-raw";
import UnixDomainSocket from "./unix-domain-socket";

const mapping = [
  { key: "http_proxy", label: "HTTPProxy" },
  { key: "socks5", label: "Socks5" },
  { key: "static_file", label: "StaticFile" },
  { key: "unix_domain_socket", label: "UnixDomainSocket" },
  { key: "http2https", label: "HTTP2HTTPS" },
  { key: "https2http", label: "HTTPS2HTTP" },
  { key: "https2https", label: "HTTPS2HTTPS" },
  { key: "tls2raw", label: "TLS2Raw" },
];

function PluginForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<ProxySchemaType & { _: { pluginEnable: boolean } }>();
  const { pluginEnable } = values?._ ?? {};

  const plugin = useMemo(() => {
    return ({
      http_proxy: <HTTPProxy />,
      socks5: <Socks5 />,
      static_file: <StaticFile />,
      unix_domain_socket: <UnixDomainSocket />,
      http2https: <HTTP2HTTPS />,
      https2http: <HTTPS2HTTP />,
      https2https: <HTTPS2HTTPS />,
      tls2raw: <TLS2Raw />,
    } as any)[values.plugin?.type ?? ""];
  }, [values.plugin?.type]);

  return (
    <Flex direction="column" gap="3">
      <Form.Switch
        name="_.pluginEnable"
        label={t("formatting.upper_first", { value: t("enable") })}
        onCheckedChange={(value) => {
          !value && setFieldValue("plugin", { type: "" });
        }}
      />

      {pluginEnable
        ? (
            <>
              <Form.Select
                name="plugin.type"
                label={t("formatting.upper_first", { value: t("type") })}
                trigger={{ className: ":uno: min-w-52" }}
                onValueChange={(value) => {
                  setFieldValue("plugin", { type: value });
                }}
                unselectable={false}
              >
                {mapping.map(item => (
                  <Select.Item key={item.key} value={item.key}>{item.label}</Select.Item>
                ))}
              </Form.Select>

              {plugin}
            </>
          )
        : null}
    </Flex>
  );
}

PluginForm.mapping = mapping;

export default PluginForm;
