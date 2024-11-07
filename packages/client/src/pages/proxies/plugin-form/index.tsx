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

export default function PluginForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<ProxySchemaType>();

  const plugin = useMemo(() => {
    return ({
      httpproxy: <HTTPProxy />,
      socks5: <Socks5 />,
      staticfile: <StaticFile />,
      unixdomainsocket: <UnixDomainSocket />,
      http2https: <HTTP2HTTPS />,
      https2http: <HTTPS2HTTP />,
      https2https: <HTTPS2HTTPS />,
      tls2raw: <TLS2Raw />,
    } as any)[values.plugin?.type ?? ""];
  }, [values.plugin?.type]);

  return (
    <Flex direction="column" gap="3">
      <Form.Select
        name="plugin.type"
        label={t("formatting.upper_first", { value: t("type") })}
        trigger={{ className: ":uno: min-w-52" }}
        onValueChange={(value) => {
          setFieldValue("plugin", { type: value });
        }}
      >
        {["HTTPProxy", "Socks5", "StaticFile", "UnixDomainSocket", "HTTP2HTTPS", "HTTPS2HTTP", "HTTPS2HTTPS", "TLS2Raw"].map(label => (
          <Select.Item key={label.toLowerCase()} value={label.toLowerCase()}>{label}</Select.Item>
        ))}
      </Form.Select>

      {plugin}
    </Flex>
  );
}
