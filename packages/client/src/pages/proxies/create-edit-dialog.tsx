import type { FormikProps } from "formik";
import type { Ref } from "react";

import { proxyStatus } from "@/apis/endpoints";
import Form from "@/components/form";
import { Button, Dialog, Flex, Select, Tabs } from "@radix-ui/themes";
import { consola } from "consola";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const proxySchema = proxyStatus.pick({ name: true, type: true }).merge(z.object({
  localIP: z.string().ip().nullish(),
  localPort: z.number().min(0).max(65535).nullish(),
  annotations: z
    .array(z.array(z.string()))
    .nullish()
    .transform<string[][]>(value => value && Object.fromEntries(value.filter(([key]) => !!key))),
}));

type ProxyType = z.infer<typeof proxySchema>;

interface RefType {
  create: () => void;
  edit: (data?: ProxyType) => void;
};

function BasicForm(_props: { helper: FormikProps<ProxyType> }) {
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
  const [proxy, setProxy] = useState<ProxyType>();
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="480px">
        <Dialog.Title>{t("formatting.upper_first", { value: t(isEdit ? "edit" : "create") })}</Dialog.Title>
        <Dialog.Description />

        <Tabs.Root defaultValue="basic">
          <Tabs.List>
            <Tabs.Trigger value="basic">{t("formatting.upper_first", { value: t("basic") })}</Tabs.Trigger>
          </Tabs.List>

          <Formik
            initialValues={proxy ?? {
              name: "",
              type: "http",
              localIP: "127.0.0.1",
              localPort: "",
              annotations: [["", ""]],
            } as unknown as ProxyType}
            onSubmit={(values) => {
              const parsed = proxySchema.parse(values);
              consola.debug(parsed);
            }}
            validate={(values) => {
              const parsed = proxySchema.safeParse(values);
              if (parsed.success) {
                return {};
              }
              return parsed.error.flatten().fieldErrors;
            }}
          >
            {helper => (
              <form onSubmit={helper.handleSubmit} autoComplete="off" className=":uno: mt-4">
                <Tabs.Content value="basic">
                  <BasicForm helper={helper} />
                </Tabs.Content>

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
            )}
          </Formik>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default forwardRef(CreateEditDialog);
