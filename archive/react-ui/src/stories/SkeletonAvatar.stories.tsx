import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { SkeletonAvatar } from "../ui";

const meta = {
  title: "Antd/SkeletonAvatar",
  component: SkeletonAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "radio", type: "string", options: ["circle", "square"] },
    size: { control: "radio", type: "string", options: ["default", "large", "small"] },
  },
} satisfies Meta<typeof SkeletonAvatar>;

export default meta;
type Story = StoryObj<typeof SkeletonAvatar>;

const Template: StoryFn<typeof SkeletonAvatar> = (args) => {
  return <SkeletonAvatar {...args} />;
};

export const Primary: Story = {
  render: Template,
  args: {
    active: true,
    shape: "square",
    size: "default",
  },
};
