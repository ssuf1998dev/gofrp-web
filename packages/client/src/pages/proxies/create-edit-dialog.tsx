import type { Ref } from "react";
import type { z } from "zod";

import { Button, Dialog, Flex } from "@radix-ui/themes";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import { proxyStatus } from "../../apis/endpoints";
import Form from "../../components/form";

interface RefType {
  create: () => void;
  edit: (data?: z.infer<typeof proxyStatus>) => void;
};

function CreateEditDialog(_props: unknown, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [proxy, setProxy] = useState<z.infer<typeof proxyStatus>>();
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
          initialValues={proxy ?? {}}
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
                <Form.TextField
                  name="local_addr"
                  label={t("formatting.sentence_case", { value: t("local_addr") })}
                  required
                />
                <Form.TextField
                  name="remote_addr"
                  label={t("formatting.sentence_case", { value: t("remote_addr") })}
                  required
                />
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
