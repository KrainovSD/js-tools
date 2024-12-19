import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Flex, SkeletonImage } from "../ui";

const meta = {
  title: "Antd/SkeletonImage",
  component: SkeletonImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof SkeletonImage>;

export default meta;
type Story = StoryObj<typeof SkeletonImage>;

const Template: StoryFn<typeof SkeletonImage> = (args) => {
  return (
    <Flex style={{ width: 300 }}>
      <SkeletonImage {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    active: true,
    size: 40,
  },
};
