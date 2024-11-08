import type { FormikProps } from "formik";
import type { Ref } from "react";

import { proxySchema, type ProxySchemaType } from "@/apis/schema";
import { Button, Dialog, Flex, Tabs } from "@radix-ui/themes";
import { consola } from "consola";
import { Formik, useFormikContext } from "formik";
import { get, set } from "lodash-es";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import BasicForm from "./basic-form";
import LoadBalancerForm from "./load-balancer-form";
import PluginForm from "./plugin-form";
import TransportForm from "./transport-form";

interface RefType {
  create: () => void;
  edit: (data?: ProxySchemaType) => void;
};

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
    { key: "loadBalancer", label: t("formatting.upper_first", { value: t("load_balancer") }) },
  ], [t]);

  const tabsContents = useMemo(() => [
    { key: "basic", node: <BasicForm /> },
    { key: "plugin", node: <PluginForm /> },
    { key: "transport", node: <TransportForm /> },
    { key: "loadBalancer", node: <LoadBalancerForm /> },
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
              consola.debug(errors, parsed.error.errors);
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
