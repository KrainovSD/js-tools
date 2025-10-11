import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Divider, Flex } from "../ui";

const meta = {
  title: "Antd/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", type: "string", options: ["vertical", "horizontal"] },
    variant: { control: "radio", type: "string", options: ["solid", "dotted", "dashed"] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof Divider>;

const Template: StoryFn<typeof Divider> = (args) => {
  return (
    <Flex style={{ width: 800, height: 100 }}>
      <Divider {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    variant: "solid",
    type: "horizontal",
  },
};
