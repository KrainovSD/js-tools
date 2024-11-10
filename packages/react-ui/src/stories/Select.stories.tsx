import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import { Flex, Select } from "../ui";

const meta = {
  title: "Antd/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    allowClear: { control: "boolean", type: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => {
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <Flex style={{ width: 300 }}>
      <Select {...args} value={value} onChange={setValue} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    wide: true,
    options: [
      { label: "Значение1", value: "Значение1" },
      { label: "Значение2", value: "Значение2" },
      { label: "Значение3", value: "Значение3" },
    ],
  },
};
