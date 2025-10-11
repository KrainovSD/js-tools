import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Badge } from "../ui";

const meta = {
  title: "Antd/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    count: { control: "number", type: "number" },
    overflowCount: { control: "number", type: "number" },
  },
  args: {
    onClick: fn(),
    custom: false,
    count: 1,
    customColor: "red",
    customSize: 16,
    overflowCount: 100,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

const Template: StoryFn<typeof Badge> = (args) => {
  return <Badge {...args} />;
};

export const Primary: Story = {
  render: Template,
  args: {},
};
