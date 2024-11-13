import type { proxyStatus } from "@/apis/endpoints";
import type { Ref } from "react";
import type { z } from "zod";

import apis from "@/apis";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useAsync } from "@react-hookz/web";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface RefType {
  open: (data?: z.infer<typeof proxyStatus>) => void;
};

function DeleteDialog(props: { onConfirm?: () => void }, ref: Ref<RefType>) {
  const { t } = useTranslation();
  const { onConfirm } = props;
  const [open, setOpen] = useState(false);
  const [proxy, setProxy] = useState<z.infer<typeof proxyStatus>>();

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      setProxy(data);
    },
  }));

  const $delete = useAsync(async (name: string) => {
    const config = await apis.getConfig({ headers: { Accept: "application/toml" } });
    config.proxies = ((config.proxies ?? []) as any[]).filter(item => item.name !== name);
    await apis.setConfig(config, { headers: { "Content-Type": "application/toml" } });
  });

  return (
    <AlertDialog.Root
      {...props}
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialog.Content maxWidth="360px">
        <AlertDialog.Title>{t("formatting.upper_first", { value: t("delete") })}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {t("delete_proxy_message", { what: proxy?.name })}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={$delete[0].status === "loading"}>
              {t("formatting.upper_first", { value: t("cancel") })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              loading={$delete[0].status === "loading"}
              onClick={async (evt) => {
                if (!proxy) {
                  return;
                }

                evt.preventDefault();
                await $delete[1].execute(proxy.name);
                setOpen(false);
                onConfirm?.();
              }}
            >
              {t("formatting.upper_first", { value: t("confirm") })}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default forwardRef(DeleteDialog);
