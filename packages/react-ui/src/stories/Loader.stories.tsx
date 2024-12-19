import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Flex, Loader } from "../ui";

const meta = {
  title: "Antd/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
  args: {},
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof Loader>;

const Template: StoryFn<typeof Loader> = (args) => {
  return (
    <Flex style={{ width: 400, height: 400, background: "gray" }} align="center" justify="center">
      <Flex style={{ width: 200, height: 200, position: "relative" }}>
        <Loader {...args} />
      </Flex>
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    background: "single",
  },
};
