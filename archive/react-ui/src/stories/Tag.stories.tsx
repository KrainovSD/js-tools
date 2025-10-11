import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Tag } from "../ui";

const meta = {
  title: "Antd/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    mainColor: { control: "color" },
  },
  args: { onClick: fn(), onClose: fn() },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof Tag>;

const Template: StoryFn<typeof Tag> = (args) => {
  return <Tag {...args}></Tag>;
};

export const Primary: Story = {
  render: Template,
  args: {
    children: "Тэг",
    closeIcon: true,
  },
};
