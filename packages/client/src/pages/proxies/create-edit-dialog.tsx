import type { Ref } from "react";
import type { z } from "zod";

import { Button, Dialog, Flex, Select } from "@radix-ui/themes";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import { proxyStatus } from "../../apis/endpoints";
import Form from "../../components/form";

type ProxyType = Pick<z.infer<typeof proxyStatus>, "name" | "type">;

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
        <Dialog.Title>{t("formatting.sentence_case", { value: t(isEdit ? "edit" : "create") })}</Dialog.Title>
        <Dialog.Description />

        <Formik
          initialValues={proxy ?? { name: "", type: "" }}
          onSubmit={() => {}}
          validate={(values) => {
            const parsed = proxyStatus.safeParse(values);
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
                  label={t("formatting.sentence_case", { value: t("name") })}
                  required
                />
                <Form.Select
                  name="type"
                  label={t("formatting.sentence_case", { value: t("type") })}
                  required
                >
                  {["tcp", "udp", "http", " https", "tcpmux", " stcp", "sudp", "xtcp"].map(item => (
                    <Select.Item key={item} value={item}>
                      {item.toUpperCase()}
                    </Select.Item>
                  ))}
                </Form.Select>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    {t("formatting.sentence_case", { value: t("cancel") })}
                  </Button>
                </Dialog.Close>
                <Button variant="solid" type="submit">
                  {t("formatting.sentence_case", { value: t("confirm") })}
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
