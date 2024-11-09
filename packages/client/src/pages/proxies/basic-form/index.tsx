import type { ProxySchemaType } from "@/apis/schema";

import Form from "@/components/form";
import { Flex, Select } from "@radix-ui/themes";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import HTTP from "./http";
import HTTPS from "./https";
import STCP from "./stcp";
import SUDP from "./sudp";
import TCP from "./tcp";
import TCPMux from "./tcp-mux";
import UDP from "./udp";
import XTCP from "./xtcp";

export default function BasicForm() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<ProxySchemaType>();

  const type = useMemo(() => {
    return ({
      tcp: <TCP />,
      udp: <UDP />,
      http: <HTTP />,
      https: <HTTPS />,
      tcpmux: <TCPMux />,
      stcp: <STCP />,
      sudp: <SUDP />,
      xtcp: <XTCP />,
    } as any)[values.type ?? ""];
  }, [values.type]);

  return (
    <Flex direction="column" gap="3">
      <Form.TextField
        name="name"
        label={t("formatting.upper_first", { value: t("name") })}
        required
      />
      <Form.Select
        name="type"
        label={t("formatting.upper_first", { value: t("type") })}
        required
        onValueChange={(value) => {
          !value && setTimeout(() => {
            new Set([...TCP.fields, ...UDP.fields, ...HTTP.fields, ...HTTPS.fields, ...TCPMux.fields, ...STCP.fields, ...SUDP.fields, ...XTCP.fields]).forEach((field) => {
              setFieldValue(field, undefined);
            });
          }, 0);
        }}
      >
        {["tcp", "udp", "http", "https", "tcpmux", "stcp", "sudp", "xtcp"].map(item => (
          <Select.Item key={item} value={item}>
            {item.toUpperCase()}
          </Select.Item>
        ))}
      </Form.Select>
      <Form.TextField
        name="localIP"
        label={t("formatting.upper_first", { value: t("local_ip") })}
      />
      <Form.TextField
        name="localPort"
        label={t("formatting.upper_first", { value: t("local_port") })}
        type="number"
        min={0}
        max={65535}
      />

      {type}

      <Form.Entries
        name="annotations"
        label={t("formatting.upper_first", { value: t("annotations") })}
        tooltip={t("help.annotations")}
      />
      <Form.Entries
        name="metadatas"
        label={t("formatting.upper_first", { value: t("metadata") })}
        tooltip={t("help.metadata")}
      />
    </Flex>
  );
}
