import type { Ref } from "react";

import { Button, Dialog, Flex, Select } from "@radix-ui/themes";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { proxyStatus } from "../../apis/endpoints";
import Form from "../../components/form";

const proxySchema = proxyStatus.pick({ name: true, type: true }).merge(z.object({
  localIP: z.string().ip({ version: "v4" }).nullish(),
  localPort: z.number().nullish(),
}));

type ProxyType = z.infer<typeof proxySchema>;

interface RefType {
  create: () => void;
  edit: (data?: ProxyType) => void;
};

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

        <Formik
          initialValues={proxy ?? { name: "", type: "", localIP: "", localPort: "" }}
          onSubmit={() => {}}
          validate={(values) => {
            const parsed = proxySchema.safeParse(values);
            if (parsed.success) {
              return {};
            }
            return parsed.error.flatten().fieldErrors;
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
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
                />
              </Flex>

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

      </Dialog.Content>
    </Dialog.Root>
  );
}

export default forwardRef(CreateEditDialog);
