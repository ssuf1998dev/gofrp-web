import type { Ref } from "react";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface RefType {
  open: (data?: unknown) => void;
};

function DeleteDialog(_props: unknown, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content maxWidth="320px">
        <AlertDialog.Title>{t("formatting.sentence_case", { value: t("delete") })}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Description
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {t("formatting.sentence_case", { value: t("cancel") })}
            </Button>
          </AlertDialog.Cancel>
          {/* <AlertDialog.Action>
            <Button variant="solid" color="red">
              Revoke access
            </Button>
          </AlertDialog.Action> */}
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default forwardRef(DeleteDialog);
