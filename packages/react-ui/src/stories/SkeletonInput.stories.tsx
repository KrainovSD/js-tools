import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Flex, SkeletonInput } from "../ui";

const meta = {
  title: "Antd/SkeletonInput",
  component: SkeletonInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean", type: "boolean" },
    size: { control: "radio", type: "string", options: ["default", "large", "small"] },
  },
} satisfies Meta<typeof SkeletonInput>;

export default meta;
type Story = StoryObj<typeof SkeletonInput>;

const Template: StoryFn<typeof SkeletonInput> = (args) => {
  return (
    <Flex style={{ width: 300, height: 100 }}>
      <SkeletonInput {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    wide: true,
    active: true,
    size: "large",
  },
};
