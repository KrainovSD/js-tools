import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "../ui";

const meta = {
  title: "Antd/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: "normal",
  },
};
