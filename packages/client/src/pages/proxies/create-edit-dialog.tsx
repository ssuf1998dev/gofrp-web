import type { FormikProps } from "formik";
import type { Ref } from "react";

import { proxySchema, type ProxySchemaType } from "@/apis/schema";
import Form from "@/components/form";
import { Button, Dialog, Flex, RadioGroup, Select, Tabs } from "@radix-ui/themes";
import { consola } from "consola";
import { Formik, useFormikContext } from "formik";
import { get, set } from "lodash-es";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import PluginForm from "./plugin-form";

interface RefType {
  create: () => void;
  edit: (data?: ProxySchemaType) => void;
};

function BasicForm() {
  const { t } = useTranslation();

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
      >
        {["tcp", "udp", "http", " https", "tcpmux", " stcp", "sudp", "xtcp"].map(item => (
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

function TransportForm() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="3">
      <Form.Switch
        name="transport.useEncryption"
        label={t("formatting.upper_first", { value: t("enable_encryption") })}
      />
      <Form.Switch
        name="transport.useCompression"
        label={t("formatting.upper_first", { value: t("enable_compression") })}
      />
      <Form.TextField
        name="transport.bandwidthLimit"
        label={t("formatting.upper_first", { value: t("bandwidth_limit") })}
        type="number"
        units={[{ key: "KiB" }, { key: "MiB" }]}
      />
      <Form.RadioGroup
        name="transport.bandwidthLimitMode"
        label={t("formatting.upper_first", { value: t("bandwidth_limit_mode") })}
        direction="row"
      >
        {[
          { key: "client", label: t("formatting.upper_first", { value: t("client") }) },
          { key: "server", label: t("formatting.upper_first", { value: t("server") }) },
        ].map(item => (
          <RadioGroup.Item key={item.key} value={item.key}>{item.label}</RadioGroup.Item>
        ))}
      </Form.RadioGroup>
      <Form.RadioGroup
        name="transport.proxyProtocolVersion"
        label={t("formatting.upper_first", { value: t("protocol_version") })}
        direction="row"
      >
        {[{ key: "v1" }, { key: "v2" }].map(item => (
          <RadioGroup.Item key={item.key} value={item.key}>{item.key}</RadioGroup.Item>
        ))}
      </Form.RadioGroup>
    </Flex>
  );
}

function DebugForm() {
  const { values } = useFormikContext();
  useEffect(() => {
    const parsed = proxySchema.safeParse(values);
    parsed.success && consola.debug(parsed.data);
  }, [values]);
  return null;
}

function CreateEditDialog(_props: unknown, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [proxy, setProxy] = useState<ProxySchemaType>();
  const [isEdit, setIsEdit] = useState(false);

  useImperativeHandle(ref, () => ({
    create: () => {
      setOpen(true);
      setProxy(undefined);
      setIsEdit(false);
    },
    edit: (data) => {
      setOpen(true);
      setProxy(data);
      setIsEdit(true);
    },
  }));

  const tabsTriggers = useMemo(() => [
    { key: "basic", label: t("formatting.upper_first", { value: t("basic") }) },
    { key: "plugin", label: t("formatting.upper_first", { value: t("plugin") }) },
    { key: "transport", label: t("formatting.upper_first", { value: t("transport") }) },
  ], [t]);

  const tabsContents = useMemo(() => [
    { key: "basic", node: <BasicForm /> },
    { key: "plugin", node: <PluginForm /> },
    { key: "transport", node: <TransportForm /> },
  ], []);

  const formRef = useRef<FormikProps<ProxySchemaType | object>>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="480px">
        <Dialog.Title>{t("formatting.upper_first", { value: t(isEdit ? "edit" : "create") })}</Dialog.Title>
        <Dialog.Description />

        <Tabs.Root defaultValue="basic">
          <Formik
            innerRef={formRef}
            initialValues={proxy ?? {}}
            onSubmit={(values) => {
              const parsed = proxySchema.parse(values);
              consola.debug(parsed);
            }}
            validate={(values) => {
              const parsed = proxySchema.safeParse(values);
              if (parsed.success) {
                return {};
              }
              const errors = {};
              // const touched = {};
              parsed.error.errors.forEach((error) => {
                const prev = get(errors, error.path);
                set(errors, error.path, [prev, error].flat().filter(Boolean));
                // set(touched, error.path, true);
              });
              // formRef.current?.setTouched(touched, false);
              consola.debug(errors);
              return errors;
            }}
          >
            {({ handleSubmit }) => (
              <>
                <Tabs.List>
                  {tabsTriggers.map((item) => {
                    return (
                      <Tabs.Trigger value={item.key} key={item.key}>
                        {item.label}
                      </Tabs.Trigger>
                    );
                  })}
                </Tabs.List>

                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  className=":uno: mt-4"
                >
                  {tabsContents.map(item => <Tabs.Content key={item.key} value={item.key} className=":uno: min-h-36">{item.node}</Tabs.Content>)}

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        {t("formatting.upper_first", { value: t("cancel") })}
                      </Button>
                    </Dialog.Close>
                    <Button variant="solid" type="submit">
                      {t("formatting.upper_first", { value: t("confirm") })}
                    </Button>
                  </Flex>
                </form>

                {process.env.NODE_ENV === "development" ? <DebugForm /> : null}
              </>
            )}
          </Formik>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default forwardRef(CreateEditDialog);
