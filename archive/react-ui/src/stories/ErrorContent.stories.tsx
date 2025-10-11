import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TranslateProvider } from "../providers";
import { ErrorContent } from "../ui";

const meta = {
  title: "Antd/ErrorContent",
  component: ErrorContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { type: "function" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ErrorContent>;

export default meta;
type Story = StoryObj<typeof ErrorContent>;

const Template: StoryFn<typeof ErrorContent> = (args) => {
  return (
    <TranslateProvider>
      <ErrorContent {...args} />
    </TranslateProvider>
  );
};

export const Primary: Story = {
  render: Template,
  args: {},
};
