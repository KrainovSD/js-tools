import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Flex, SkeletonTitle } from "../ui";

const meta = {
  title: "Antd/SkeletonTitle",
  component: SkeletonTitle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: "number", type: "number" },
  },
} satisfies Meta<typeof SkeletonTitle>;

export default meta;
type Story = StoryObj<typeof SkeletonTitle>;

const Template: StoryFn<typeof SkeletonTitle> = (args) => {
  return (
    <Flex style={{ width: 300 }}>
      <SkeletonTitle {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    active: true,
    width: 50,
    wide: true,
  },
};
