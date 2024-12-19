import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { DatePicker, Flex } from "../ui";

const meta = {
  title: "Antd/DatePicker",
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = (args) => {
  return (
    <Flex style={{ width: 800 }}>
      <DatePicker {...args} />
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
