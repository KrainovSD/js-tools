import type { Meta, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VInput, VPopConfirm, VPopover, VSelect } from "../ui";

const meta = {
  title: "Components/Popover",
  component: VPopover,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => ({
    components: { VPopover },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VPopover,
          { ...args },
          {
            default: () => h(VButton, {}, () => "Click"),
            content: () => [
              h(VSelect, {
                multiple: true,
                nested: true,
                modelValue: ["first"],
                options: [
                  { label: "first", value: "first" },
                  { label: "second", value: "second" },
                  { label: "third", value: "third" },
                ],
              }),
              h(VInput),
              h(VSelect, {
                nested: true,
                options: [
                  { label: "first", value: "first" },
                  { label: "second", value: "second" },
                  { label: "third", value: "third" },
                ],
              }),
              h(
                VPopConfirm,
                { text: "Большое спасибо за внимание?", title: "Внимание", nested: true },
                () => h(VButton, {}, () => "Применить"),
              ),
            ],
          },
        ),
      ]);
    },
  }),
  args: {},
};
