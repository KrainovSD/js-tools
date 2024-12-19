import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import { Flex, Search } from "../ui";

const meta = {
  title: "Antd/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", type: "string", options: ["outlined", "filled", "borderless"] },
    selectedTags: { if: { arg: "tags", exists: true } },
    setSelectedTag: { if: { arg: "tags", exists: true } },
    clearTags: { if: { arg: "tags", exists: true } },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof Search>;

const Template: StoryFn<typeof Search> = (args) => {
  const [search, setSearch] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  return (
    <Flex style={{ width: 300, height: 200 }}>
      <Search
        {...args}
        setSearch={setSearch}
        search={search}
        selectedTags={selectedTags}
        setSelectedTag={setSelectedTags}
      />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    label: "Поиск",
    variant: "outlined",
    shape: "square",
    tags: [
      { color: "#CB6D95", colorBg: "#F5E0E9", label: "Процесс", value: "process" },
      { color: "#AF8E47", colorBg: "#FDECC8", label: "Задача", value: "task" },
      { color: "#CA844F", colorBg: "#FADEC9", label: "Уведомление", value: "notice" },
      { color: "#6EA56E", colorBg: "#DBEDDB", label: "Модуль", value: "module" },
      { color: "#A377BD", colorBg: "#E8DEEE", label: "Аналитика", value: "analytic" },
    ],
  },
};
