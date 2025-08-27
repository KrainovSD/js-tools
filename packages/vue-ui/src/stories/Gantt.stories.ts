import type { Meta, StoryObj } from "@storybook/vue3";
import { type Component, type DefineComponent, h } from "vue";
import GanttVirtualRow from "../tech/Gantt/GanttVirtualRow.vue";
import { VTable } from "../ui";
import type { GanttProps } from "../ui/Table/types";

const Gantt = VTable as unknown as DefineComponent<
  GanttProps<unknown, {}, {}, {}, {}, {}, {}, {}, {}>
>;

const meta = {
  title: "Components/Gantt",
  component: Gantt,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Gantt>;

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

export const GanttVirtual = createTableStory(GanttVirtualRow);
