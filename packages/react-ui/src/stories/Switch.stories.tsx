import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Switch } from "../ui";

const meta = {
  title: "Antd/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    customColorBg: { control: "color" },
    customColorBgActive: { control: "color" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

const Template: StoryFn<typeof Switch> = (args) => {
  return <Switch {...args} />;
};

export const Primary: Story = {
  render: Template,
  args: {},
};
