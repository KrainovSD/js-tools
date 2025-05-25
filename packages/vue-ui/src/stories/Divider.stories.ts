import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VDivider } from "../ui";

const meta = {
  title: "Components/Divider",
  component: VDivider,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VDivider> = (args) => ({
  components: { VDivider },
  setup() {
    return { args };
  },
  render: () =>
    h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VDivider, { ...args }),
    ]),
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VDivider },
    setup() {
      return { args };
    },
    render: () =>
      h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VDivider, { variant: "solid" }),
        h(VDivider, { variant: "dashed" }),
        h(VDivider, { variant: "dotted" }),
        h("div", { style: { display: "flex", gap: "20px" } }, [
          h("span", {}, "Text"),
          h(VDivider, { type: "vertical", variant: "solid" }),
          h("span", {}, "Text"),
          h(VDivider, { type: "vertical", variant: "dashed" }),
          h("span", {}, "Text"),
          h(VDivider, { type: "vertical", variant: "dotted" }),
          h("span", {}, "Text"),
        ]),
        h(
          VDivider,
          { orientation: "center" },
          h("span", { style: { whiteSpace: "nowrap", padding: "0px 10px" } }, "Center"),
        ),
        h(
          VDivider,
          { orientation: "left" },
          h("span", { style: { whiteSpace: "nowrap", padding: "0px 10px" } }, "Left"),
        ),
        h(
          VDivider,
          { orientation: "right" },
          h("span", { style: { whiteSpace: "nowrap", padding: "0px 10px" } }, "Right"),
        ),
      ]),
  }),
  args: {},
};
