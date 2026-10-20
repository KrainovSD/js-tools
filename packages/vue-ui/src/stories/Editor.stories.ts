import type { Meta, StoryObj } from "@storybook/vue3";
import { type Component, h } from "vue";
import Editor from "../tech/Editor.vue";
import { VEditor } from "../ui";

const meta = {
  title: "Components/Editor",
  component: VEditor,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VEditor>;

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
              overflow: "auto",
              padding: "10px",
              flexDirection: "column",
              gap: "16px",
            },
          },
          [h(component)],
        );
      },
    }),
    args: {},
  };
}

export const Common = createTableStory(Editor);
