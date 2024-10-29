import type { BadgeProps } from "@radix-ui/themes";

import { Badge, Flex, IconButton, Spinner, Table } from "@radix-ui/themes";
import { useAsync, useMountEffect } from "@react-hookz/web";
import IconTablerRefresh from "~icons/tabler/refresh";
import { snakeCase } from "change-case";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import apis from "../../apis";

export default function Proxies() {
  const { t } = useTranslation();

  const $list = useAsync(
    async () =>
      Object.values(await apis.getStatus()).flat(),
    [],
  );

  useMountEffect(() => {
    $list[1].execute();
  });

  return (
    <Flex direction="column" gap="4" className="h-full">
      <Flex>
        <span className=":uno: flex-grow-1" />
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
        <Table.Root
          variant="surface"
          className={clsx(":uno: min-h-42", { ":uno: h-42": $list[0].status === "loading" })}
        >
          <Table.Header>
            <Table.Row>
              {["name", "type", "status", "local_addr", "remote_addr", "plugin"].map(key => (
                <Table.ColumnHeaderCell key={key}>
                  {t("formatting.capital_case", { value: t(snakeCase(key)) })}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body className=":uno: [&_.rt-TableCell:empty]:after:content-fine-empty">
            {$list[0].result.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Table.Row key={idx}>
                {(["name", "type", "status", "local_addr", "remote_addr", "plugin"] as Array<keyof typeof item>).map((key) => {
                  if (key === "status") {
                    return (
                      <Table.Cell key={key}>
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
                      </Table.Cell>
                    );
                  }

                  return <Table.Cell key={key}>{item[key]}</Table.Cell>;
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Spinner>
    </Flex>
  );
}
