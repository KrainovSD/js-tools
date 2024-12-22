import { Module } from "@krainovsd/react-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "../ui";

const meta = {
  title: "Antd/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      type: "string",
      options: ["default", "primary", "dashed", "text", "link"],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => {
  return <Button {...args} icon={<Module color="black" size={16} />} />;
};

export const Primary: Story = {
  render: Template,
  args: {
    type: "default",
  },
};
