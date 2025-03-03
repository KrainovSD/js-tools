import { randomString } from "@krainovsd/js-helpers";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { type AnyObject } from "antd/es/_util/type";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { Flex, Table } from "../ui";

const meta = {
  title: "Antd/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table<TableData>>;

export default meta;
type Story = StoryObj<typeof Table<TableData>>;

const dataSource = Array.from({ length: 40 }, (_, index) => {
  return {
    id: index,
    name: randomString(6),
    country: randomString(6),
    email: randomString(6),
  };
});

type TableData = { name: string; country: string; email: string };

const filters = [
  {
    text: "start with A",
    value: "A",
  },
  {
    text: "start with B",
    value: "B",
  },
  {
    text: "start with C",
    value: "C",
  },
  {
    text: "start with D",
    value: "D",
  },
];

const columns: ColumnsType<TableData> = [
  {
    title: "Имя",
    width: 300,
    key: "name",
    dataIndex: "name",
    filters,
    onFilter: (value, record) => record.name.startsWith(value as string),
    sorter: (itemA, itemB) => (itemA.name === itemB.name ? 0 : itemA.name > itemB.name ? 1 : -1),
    sortDirections: ["ascend"],
    defaultSortOrder: "ascend",
  },
  {
    title: "Страна",
    width: 300,
    key: "country",
    dataIndex: "country",
    filters,
    onFilter: (value, record) =>
      record.country.toLowerCase().startsWith(String(value).toLowerCase()),
    sorter: (itemA, itemB) =>
      itemA.country === itemB.country ? 0 : itemA.country > itemB.country ? 1 : -1,
  },
  {
    title: "Почта",
    width: 300,
    key: "email",
    dataIndex: "email",
    filters,
    onFilter: (value, record) => record.email.startsWith(value as string),
    sorter: (itemA, itemB) =>
      itemA.email === itemB.email ? 0 : itemA.email > itemB.email ? 1 : -1,
  },
];

const Template: StoryFn<typeof Table<TableData>> = (args) => {
  const [selectedRows, setSelectedRows] = React.useState<Record<string, unknown>[]>([]);

  return (
    <Flex
      style={{
        width: 800,
        height: 600,
        display: "flex",
        overflow: "hidden auto",
        position: "relative",
        border: "1px black dashed",
        padding: "20px 20px 0px 20px",
      }}
    >
      <Table
        {...args}
        selectedRows={selectedRows.map((item) => item.id as string)}
        setSelectedRows={setSelectedRows}
        downBar={
          !!selectedRows.length && <Flex style={{ color: "white" }}>{selectedRows.length}</Flex>
        }
      />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    bordered: true,
    dataSource,
    columns: columns as AnyObject[],
    rowKey: "id",
    pagination: {
      position: ["bottomRight"],
      pageSize: 20,
    },
  },
};
