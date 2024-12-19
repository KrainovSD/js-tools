import { Icon } from "@krainovsd/icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button, Import } from "../ui";

const meta = {
  title: "Antd/Import",
  component: Import,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { type: "function" },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Import>;

export default meta;
type Story = StoryObj<typeof Import>;

const Template: StoryFn<typeof Import> = (args) => {
  return (
    <Import {...args}>
      <Button size="large" type="text" icon={<Icon icon="ArrowTo" size={30} color="black" />} />
    </Import>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    accept: "application/json",
  },
};
