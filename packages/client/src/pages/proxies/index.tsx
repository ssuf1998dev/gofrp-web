import type { BadgeProps } from "@radix-ui/themes";
import type { ComponentRef } from "react";

import apis from "@/apis";
import ComplexSearch from "@/components/complex-search";
import TableEmpty from "@/components/table-empty";
import { Badge, Button, ContextMenu, Flex, IconButton, Select, Spinner, Table, Text, Tooltip } from "@radix-ui/themes";
import { useAsync, useMountEffect } from "@react-hookz/web";
import IconTablerCirclePlus from "~icons/tabler/circle-plus";
import IconTablerEdit from "~icons/tabler/edit";
import IconTablerRefresh from "~icons/tabler/refresh";
import IconTablerTrash from "~icons/tabler/trash";
import { snakeCase } from "change-case";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import CreateEditDialog from "./create-edit-dialog";
import DeleteDialog from "./delete-dialog";

export default function Proxies() {
  const { t } = useTranslation();

  const [searched, setSearched] = useState<Record<string, any>>({ name: "", status: "" });

  const $list = useAsync(
    async () =>
      Object.values(await apis.getStatus()).flat(),
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

  const deleteDialogRef = useRef<ComponentRef<typeof DeleteDialog>>(null);
  const createEditDialogRef = useRef<ComponentRef<typeof CreateEditDialog>>(null);

  return (
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
          <IconTablerCirclePlus />
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
            <Table.Row>
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
                  <Table.Row>
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
                          } satisfies Record<typeof item["status"], BadgeProps["color"]>)[item[key]]}
                          >
                            {t("formatting.sentence_case", { value: t(snakeCase(`status_${item[key]}`)) })}
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
                    createEditDialogRef.current?.edit(item);
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
        <Text size="2" className="ml-a color-[--gray-indicator]">
          {t("formatting.capital_case", { value: t("item_count", { count: list.length }) })}
        </Text>
      </Spinner>

      <CreateEditDialog ref={createEditDialogRef} />
      <DeleteDialog ref={deleteDialogRef} />
    </Flex>
  );
}
