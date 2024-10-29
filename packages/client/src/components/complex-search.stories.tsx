import type { Meta, StoryObj } from "@storybook/react";

import { Flex, Select } from "@radix-ui/themes";
import { useArgs } from "@storybook/preview-api";
import { useEffect } from "react";

import ComplexSearch from "./complex-search";

const meta: Meta<typeof ComplexSearch> = {
  component: ComplexSearch,
  title: "Complex Search",
};

export default meta;

type Story = StoryObj<typeof ComplexSearch>;

export const basic: Story = {
  name: "Basic",
  argTypes: {
    selectProps: { table: { disable: true } },
    selectContentProps: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    selectItems: ["text", "select"] as any,
    types: {
      text: { type: "text" },
      select: {
        type: "select",
        selectItems: ["0", "1", "2"] as any,
      },
    },
    value: { text: "", select: "" },
  },
  render: function Render(args) {
    const [{ selectItems, types, value }, updateArgs] = useArgs<
    { selectItems: string[]; types: any } & Record<string, any>
    >();

    useEffect(() => {
      types.select.selectItems = types.select.selectItems.map(
        (item: any) => <Select.Item key={item} value={item}>{item}</Select.Item>,
      );
    }, [types.select]);

    return (
      <Flex direction="column">
        <ComplexSearch
          {...args}
          selectItems={selectItems.map(
            item => <Select.Item key={item} value={item}>{item}</Select.Item>,
          )}
          value={value}
          onChange={(value) => {
            updateArgs({ value });
          }}
        />

      </Flex>
    );
  },
};
