import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { DateRangePicker, Flex } from "../ui";

const meta = {
  title: "Antd/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    picker: {
      control: "radio",
      type: "string",
      options: ["date", "month", "quarter", "time", "week", "year"],
    },
    format: { control: "text" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

const Template: StoryFn<typeof DateRangePicker> = (args) => {
  return (
    <Flex style={{ width: 800 }}>
      <DateRangePicker {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    picker: "date",
    format: "DD.MM.YYYY",
  },
};
