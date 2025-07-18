import type { Meta, StoryObj } from "@storybook/vue3";
import { type Component, type DefineComponent, h } from "vue";
import TableCommon from "../tech/Tables/TableCommon.vue";
import TableDragRow from "../tech/Tables/TableDragRow.vue";
import TableEmpty from "../tech/Tables/TableEmpty.vue";
import TableExpandable from "../tech/Tables/TableExpandable.vue";
import TableFrozen from "../tech/Tables/TableFrozen.vue";
import TableFullFeature from "../tech/Tables/TableFullFeature.vue";
import TableFullVirtual from "../tech/Tables/TableFullVirtual.vue";
import TableGrouped from "../tech/Tables/TableGrouped.vue";
import TableLoading from "../tech/Tables/TableLoading.vue";
import TableRubberColumn from "../tech/Tables/TableRubberColumn.vue";
import TableVirtualRow from "../tech/Tables/TableVirtualRow.vue";
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

function createTableStory(component: Component): Story {
  return {
    render: (args) => ({
      components: { component },
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
              padding: "10px",
            },
          },
          [h(component)],
        );
      },
    }),
    args: {
      columns: [],
      rows: [],
    },
  };
}

export const FullFeature = createTableStory(TableFullFeature);
export const Common = createTableStory(TableCommon);
export const Empty = createTableStory(TableEmpty);
export const Loading = createTableStory(TableLoading);
export const DragRow = createTableStory(TableDragRow);
export const Frozen = createTableStory(TableFrozen);
export const RowVirtual = createTableStory(TableVirtualRow);
export const FullVirtual = createTableStory(TableFullVirtual);
export const RubberColumn = createTableStory(TableRubberColumn);
export const Expandable = createTableStory(TableExpandable);
export const Grouped = createTableStory(TableGrouped);
