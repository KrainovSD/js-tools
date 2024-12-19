import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Flex, Input } from "../ui";

const meta = {
  title: "Antd/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", type: "string", options: ["large", "middle", "small"] },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => {
  return (
    <Flex style={{ width: 400 }}>
      <Input {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    size: "middle",
    shape: "square",
  },
};
