import type { Meta, StoryObj } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import TableCommon from "../tech/Tables/TableCommon.vue";
import { VTable } from "../ui";
import type { TableProps } from "../ui/Table/types";

const Table = VTable as unknown as DefineComponent<
  TableProps<unknown, {}, {}, {}, {}, {}, {}, {}, {}, {}>
>;

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Common: Story = {
  render: (args) => ({
    components: { TableCommon },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            width: "calc(100vw - 50px)",
            height: "calc(100vh - 50px)",
            overflow: "hidden",
          },
        },
        [h(TableCommon)],
      );
    },
  }),
  args: {
    columns: [],
    rows: [],
  },
};
