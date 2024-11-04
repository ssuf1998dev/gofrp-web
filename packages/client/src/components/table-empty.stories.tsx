import type { Meta, StoryObj } from "@storybook/react";

import { Table } from "@radix-ui/themes";

import TableEmpty from "./table-empty";

const meta: Meta<typeof TableEmpty> = {
  component: TableEmpty,
  title: "Table Empty",
};

export default meta;

type Story = StoryObj<typeof TableEmpty>;

export const basic: Story = {
  name: "Basic",
  render: function Render() {
    return (
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>0</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>1</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>2</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableEmpty />
        </Table.Body>
      </Table.Root>
    );
  },
};
