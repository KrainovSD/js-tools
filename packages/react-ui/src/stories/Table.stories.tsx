import { ksdu } from "@krainovsd/utils";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import { Flex, Table, type TableProps } from "../ui";

const meta = {
  title: "Antd/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

const dataSource = Array.from({ length: 40 }, (_, index) => {
  return {
    id: index,
    name: ksdu.utils.randomString(6),
    country: ksdu.utils.randomString(6),
    email: ksdu.utils.randomString(6),
  };
});

const columns: TableProps<Record<string, unknown>>["columns"] = [
  {
    title: "Имя",
    width: 300,
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Страна",
    width: 300,
    key: "country",
    dataIndex: "country",
  },
  {
    title: "Почта",
    width: 300,
    key: "email",
    dataIndex: "email",
  },
];

const Template: StoryFn<typeof Table> = (args) => {
  const [selectedRows, setSelectedRows] = React.useState<Record<string, unknown>[]>([]);

  return (
    <Flex
      style={{
        width: 800,
        height: 400,
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
    columns,
    rowKey: "id",
    pagination: {
      position: ["bottomRight"],
      pageSize: 20,
    },
  },
};
