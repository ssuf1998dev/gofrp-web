import type { BadgeProps } from "@radix-ui/themes";
import type { ComponentRef } from "react";

import apis from "@/apis";
import ComplexSearch from "@/components/complex-search";
import TableEmpty from "@/components/table-empty";
import { Badge, Button, ContextMenu, Flex, IconButton, Select, Spinner, Table, Text, Tooltip } from "@radix-ui/themes";
import { useAsync, useMountEffect } from "@react-hookz/web";
import IconTablerEdit from "~icons/tabler/edit";
import IconTablerPlus from "~icons/tabler/plus";
import IconTablerRefresh from "~icons/tabler/refresh";
import IconTablerTrash from "~icons/tabler/trash";
import { snakeCase } from "change-case";
import { get, set } from "lodash-es";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import CreateEditDialog from "./create-edit-dialog";
import PluginForm from "./create-edit-dialog/form/plugin";
import DeleteDialog from "./delete-dialog";

export default function Proxies() {
  const { t } = useTranslation();

  const [searched, setSearched] = useState<Record<string, any>>({ name: "", status: "" });

  const $list = useAsync(
    async () => Object.values(await apis.getStatus()).flat(),
    [],
  );

  const list = useMemo(() => $list[0].result.filter((item) => {
    const hitSearch = [
      !searched.name || item.name.toLowerCase().includes((searched.name as string).toLowerCase()),
      !searched.status || item.status === (searched.status as string),
    ].every(Boolean);

    return hitSearch;
  }), [$list, searched]);

  useMountEffect(() => {
    $list[1].execute();
  });

  const $proxy = useAsync(async (name: string) => {
    const config = await apis.getConfig({ headers: { Accept: "application/toml" } });
    const proxy = ((config?.proxies ?? []) as any[]).find(item => item.name === name);
    if (!proxy) {
      return null;
    }
    proxy.annotations && (proxy.annotations = Object.entries(proxy.annotations));
    proxy.metadatas && (proxy.metadatas = Object.entries(proxy.metadatas));
    proxy.requestHeaders && (proxy.requestHeaders = Object.entries(proxy.requestHeaders.set));
    proxy.responseHeaders && (proxy.responseHeaders = Object.entries(proxy.responseHeaders.set));

    const healthCheckHttpHeaders = get(proxy, "healthCheck.httpHeaders") as { name: string; value: string }[];
    if (healthCheckHttpHeaders) {
      set(proxy, "healthCheck.httpHeaders", healthCheckHttpHeaders.map(({ name, value }) => [name, value]));
    }

    const transportBandwidthLimit = get(proxy, "transport.bandwidthLimit");
    if (transportBandwidthLimit) {
      const [,value, unit] = /(\d*)(?:KB|MB)/.exec(transportBandwidthLimit) ?? [];
      set(proxy, "transport.bandwidthLimit", value && unit ? { value, unit } : undefined);
    }

    const pluginRequestHeaders = get(proxy, "plugin.requestHeaders.set");
    if (pluginRequestHeaders) {
      set(proxy, "plugin.requestHeaders", Object.entries(pluginRequestHeaders));
    }

    return proxy;
  });

  const deleteDialogRef = useRef<ComponentRef<typeof DeleteDialog>>(null);
  const createEditDialogRef = useRef<ComponentRef<typeof CreateEditDialog>>(null);

  return (
    <div className=":uno: px-4 pt-6 pb-8 mx-a w-full min-w-2xl max-w-5xl box-border">
      <Flex direction="column" gap="4" className="h-full">
        <Flex gap="2">
          <ComplexSearch
            value={searched}
            onChange={setSearched}
            disabled={$list[0].status === "loading"}
            selectItems={[
              <Select.Item key="name" value="name">
                {t("formatting.capital_case", { value: t("name") })}
              </Select.Item>,
              <Select.Item key="status" value="status">
                {t("formatting.capital_case", { value: t("status") })}
              </Select.Item>,
            ]}
            types={{
              name: { type: "text" },
              status: {
                type: "select",
                inputProps: { unselectable: true },
                selectItems: ["new", "wait start", "start error", "running", "check failed", "closed"].map(item => (
                  <Select.Item key={item} value={item}>
                    {t("formatting.sentence_case", { value: t(snakeCase(`status_${item}`)) })}
                  </Select.Item>
                )),
              },
            }}
          />
          <span className=":uno: flex-grow-1" />
          <Button onClick={() => {
            createEditDialogRef.current?.create();
          }}
          >
            <IconTablerPlus />
            {t("formatting.sentence_case", { value: t("create", { what: t("proxy", { count: 1 }) }) })}
          </Button>
          <IconButton
            variant="surface"
            onClick={() => {
              $list[1].reset();
              $list[1].execute();
            }}
            disabled={$list[0].status === "loading"}
          >
            <IconTablerRefresh />
          </IconButton>
        </Flex>

        <Spinner loading={$list[0].status === "loading" || $list[0].status === "not-executed"} size="3">
          <Table.Root variant="surface" className=":uno: min-h-32 [&_table]:overflow-auto! overflow-hidden">
            <Table.Header className=":uno: pos-sticky top-0 bg-[--color-background]">
              <Table.Row className=":uno: vertical-middle">
                {["name", "type", "status", "local_addr", "remote_addr", "plugin"].map(key => (
                  <Table.ColumnHeaderCell key={key}>
                    {t("formatting.capital_case", { value: t(snakeCase(key)) })}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body className=":uno: [&_.rt-TableCell:empty]:after:content-[--empty-indicator]">
              {list.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
                <ContextMenu.Root key={idx}>
                  <ContextMenu.Trigger>
                    <Table.Row className="hover:bg-[--gray-a2] vertical-middle">
                      {(["name", "type", "status", "local_addr", "remote_addr", "plugin"] as Array<keyof typeof item>).map((key) => {
                        if (key === "status") {
                          const node = (
                            <Badge color={({
                              "new": "blue",
                              "wait start": "orange",
                              "start error": "red",
                              "running": "green",
                              "check failed": "red",
                              "closed": "gray",
                            } satisfies Record<typeof item["status"], BadgeProps["color"]>)[item.status]}
                            >
                              {t("formatting.sentence_case", { value: t(snakeCase(`status_${item.status}`)) })}
                            </Badge>
                          );
                          return (
                            <Table.Cell key={key}>
                              {item.err
                                ? (
                                    <Tooltip content={item.err}>
                                      {node}
                                    </Tooltip>
                                  )
                                : node}
                            </Table.Cell>
                          );
                        }

                        if (key === "type") {
                          return <Table.Cell key={key}>{item.type.toUpperCase()}</Table.Cell>;
                        }

                        if (key === "plugin") {
                          return (
                            <Table.Cell key={key}>
                              {PluginForm.mapping.find(plugin => plugin.key === item.plugin)?.label}
                            </Table.Cell>
                          );
                        }

                        return <Table.Cell key={key}>{item[key]}</Table.Cell>;
                      })}
                    </Table.Row>
                  </ContextMenu.Trigger>
                  <ContextMenu.Content>
                    {item.name
                      ? (
                          <>
                            <ContextMenu.Item className=":uno: pointer-events-none bg-[unset]! color-[--gray-a8]">
                              {item.name}
                            </ContextMenu.Item>
                            <ContextMenu.Separator />
                          </>
                        )
                      : null}
                    <ContextMenu.Item onClick={() => {
                      createEditDialogRef.current?.edit($proxy[1].execute(item.name)
                        .then(proxy => ({
                          ...proxy,
                          // plugin: { type: proxy.plugin },
                          _: {
                            pluginEnable: !!proxy.plugin,
                            transportEnable: !!proxy.transport,
                            loadBalancerEnable: !!proxy.loadBalancer,
                            healthCheckEnable: !!proxy.healthCheck,
                          },
                        })));
                    }}
                    >
                      <IconTablerEdit />
                      {t("formatting.upper_first", { value: t("edit") })}
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      color="red"
                      onClick={() => {
                        deleteDialogRef.current?.open(item);
                      }}
                    >
                      <IconTablerTrash />
                      {t("formatting.upper_first", { value: t("delete") })}
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Root>
              ))}
              {!list.length ? <TableEmpty /> : null}
            </Table.Body>
          </Table.Root>
          <Text size="2" className=":uno: ml-a color-[--gray-indicator]">
            {t("formatting.capital_case", { value: t("item_count", { count: list.length }) })}
          </Text>
        </Spinner>

        <CreateEditDialog ref={createEditDialogRef} loading={$proxy[0].status === "loading"} />
        <DeleteDialog
          ref={deleteDialogRef}
          onConfirm={() => {
            $list[1].reset();
            $list[1].execute();
          }}
        />
      </Flex>
    </div>
  );
}
