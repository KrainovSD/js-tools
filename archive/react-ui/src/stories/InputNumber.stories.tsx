import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Flex, InputNumber } from "../ui";

const meta = {
  title: "Antd/InputNumber",
  component: InputNumber,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onChange: fn() },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof InputNumber>;

const Template: StoryFn<typeof InputNumber> = (args) => {
  return (
    <Flex style={{ width: 400 }}>
      <InputNumber {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {},
};
