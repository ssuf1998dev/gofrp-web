import type { FormikProps } from "formik";
import type { Ref } from "react";

import { proxySchema, type ProxySchemaType } from "@/apis/schema";
import { Button, Dialog, Flex, IconButton, Spinner, Tabs } from "@radix-ui/themes";
import IconTablerX from "~icons/tabler/x";
import { consola } from "consola";
import { Formik } from "formik";
import { get, set } from "lodash-es";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import BasicForm from "./basic-form";
import HealthCheckForm from "./health-check";
import LoadBalancerForm from "./load-balancer-form";
import PluginForm from "./plugin-form";
import TransportForm from "./transport-form";

type EditData = ProxySchemaType & {
  _?: Partial<{
    pluginEnable: boolean;
    loadBalancerEnable: boolean;
    transportEnable: boolean;
    healthCheckEnable: boolean;
  }>;
};

interface RefType {
  create: () => void;
  edit: (data?: EditData | Promise<EditData>) => void;
};

function CreateEditDialog(props: { loading?: boolean }, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const { loading } = props;
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
      data instanceof Promise ? data.then(setProxy) : setProxy(data);
      setIsEdit(true);
    },
  }));

  const tabsTriggers = useMemo(() => [
    { key: "basic", label: t("formatting.upper_first", { value: t("basic") }) },
    { key: "plugin", label: t("formatting.upper_first", { value: t("plugin") }) },
    { key: "transport", label: t("formatting.upper_first", { value: t("transport") }) },
    { key: "loadBalancer", label: t("formatting.upper_first", { value: t("load_balancer") }) },
    { key: "healthCheck", label: t("formatting.upper_first", { value: t("health_check") }) },
  ], [t]);

  const tabsContents = useMemo(() => [
    { key: "basic", node: <BasicForm /> },
    { key: "plugin", node: <PluginForm /> },
    { key: "transport", node: <TransportForm /> },
    { key: "loadBalancer", node: <LoadBalancerForm /> },
    { key: "healthCheck", node: <HealthCheckForm /> },
  ], []);

  const formRef = useRef<FormikProps<ProxySchemaType | object>>(null);

  const validate = useCallback((values: ProxySchemaType | object, forceTouched?: boolean) => {
    const parsed = proxySchema.safeParse(values);
    if (parsed.success) {
      return {};
    }
    const errors = {};
    const touched = {};
    parsed.error.errors.forEach((error) => {
      const prev = get(errors, error.path);
      set(errors, error.path, [prev, error].flat().filter(Boolean));
      set(touched, error.path, true);
    });
    forceTouched && formRef.current?.setTouched(touched, false);
    consola.debug(errors, parsed.error.errors, values);
    return errors;
  }, []);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        !value && setProxy(undefined);
      }}
    >
      <Dialog.Content maxWidth="580px">
        <Dialog.Title className=":uno: flex items-center" autoFocus>
          {t("formatting.upper_first", { value: t(isEdit ? "edit" : "create") })}
          <span className=":uno: flex-grow-1" />
          <Dialog.Close>
            <IconButton
              radius="full"
              variant="soft"
              size="1"
              className=":uno: justify-self-end"
              color="gray"
            >
              <IconTablerX className=":uno: text-xs" />
            </IconButton>
          </Dialog.Close>
        </Dialog.Title>
        <Dialog.Description />

        <Spinner loading={loading} size="3">
          <Tabs.Root defaultValue="basic">
            <Formik
              innerRef={formRef}
              initialValues={proxy ?? {}}
              onSubmit={(values) => {
                const parsed = proxySchema.parse(values);
                consola.debug(parsed);
              }}
              validate={validate}
            >
              {({ handleSubmit }) => (
                <>
                  <Tabs.List>
                    {tabsTriggers.map((item) => {
                      return (
                        <Tabs.Trigger
                          value={item.key}
                          key={item.key}
                          onMouseDown={(evt) => {
                            (evt.target as HTMLElement).scrollIntoView();
                          }}
                        >
                          {item.label}
                        </Tabs.Trigger>
                      );
                    })}
                  </Tabs.List>

                  <form
                    onSubmit={(evt) => {
                      handleSubmit(evt);
                      validate(formRef.current?.values ?? {}, true);
                    }}
                    autoComplete="off"
                    className=":uno: mt-4"
                  >
                    {tabsContents.map(item => (
                      <Tabs.Content key={item.key} value={item.key} className=":uno: outline-none">
                        {item.node}
                      </Tabs.Content>
                    ))}

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
        </Spinner>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default forwardRef(CreateEditDialog);
