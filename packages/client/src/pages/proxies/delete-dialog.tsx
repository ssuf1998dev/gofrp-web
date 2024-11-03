import type { Ref } from "react";
import type { z } from "zod";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

import type { proxyStatus } from "../../apis/endpoints";

interface RefType {
  open: (data?: z.infer<typeof proxyStatus>) => void;
};

function DeleteDialog(_props: unknown, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [proxy, setProxy] = useState<z.infer<typeof proxyStatus>>();

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      setProxy(data);
    },
  }));

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content maxWidth="360px">
        <AlertDialog.Title>{t("formatting.sentence_case", { value: t("delete") })}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {t("delete_proxy_message", { what: proxy?.name })}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {t("formatting.sentence_case", { value: t("cancel") })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red">
              {t("formatting.sentence_case", { value: t("confirm") })}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default forwardRef(DeleteDialog);
