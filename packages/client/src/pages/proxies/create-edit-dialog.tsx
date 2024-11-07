import type { FormikProps } from "formik";
import type { Ref } from "react";

import { proxySchema, type ProxySchemaType } from "@/apis/schema";
import Form from "@/components/form";
import { Button, Dialog, Flex, Select, Tabs } from "@radix-ui/themes";
import { consola } from "consola";
import { Formik } from "formik";
import { get, set } from "lodash-es";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
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
      <Form.NumberField
        name="localPort"
        label={t("formatting.upper_first", { value: t("local_port") })}
        min={0}
        max={65535}
      />
      <Form.Entries
        name="annotations"
        label={t("formatting.upper_first", { value: t("annotations") })}
        tooltip={t("help.annotations")}
      />
    </Flex>
  );
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
    { key: "basic", label: t("formatting.upper_first", { value: t("basic") }), errorFields: ["name", "type", "localIP", "localPort", "annotations"] },
    { key: "plugin", label: t("formatting.upper_first", { value: t("plugin") }), errorFields: ["plugin"] },
  ], [t]);

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
                  <Tabs.Content value="basic" className=":uno: min-h-36"><BasicForm /></Tabs.Content>
                  <Tabs.Content value="plugin" className=":uno: min-h-36"><PluginForm /></Tabs.Content>

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
              </>
            )}
          </Formik>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default forwardRef(CreateEditDialog);
