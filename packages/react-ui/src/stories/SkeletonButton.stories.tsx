import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { SkeletonButton } from "../ui";

const meta = {
  title: "Antd/SkeletonButton",
  component: SkeletonButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "radio", type: "string", options: ["default", "circle", "round", "square"] },
    size: { control: "radio", type: "string", options: ["default", "large", "small"] },
  },
} satisfies Meta<typeof SkeletonButton>;

export default meta;
type Story = StoryObj<typeof SkeletonButton>;

const Template: StoryFn<typeof SkeletonButton> = (args) => {
  return <SkeletonButton {...args} />;
};

export const Primary: Story = {
  render: Template,
  args: {
    active: true,
    shape: "default",
  },
};
