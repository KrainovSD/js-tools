import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VSwitch, VText } from "../ui";

const meta = {
  title: "Components/Switch",
  component: VSwitch,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VSwitch> = (args) => ({
  components: { VSwitch },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VSwitch, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args }, {}),
          h(VText, {}, () => "Common"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, size: "small" }, {}),
          h(VText, {}, () => "Mini"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(
            VSwitch,
            { ...args, size: "small" },
            { checked: () => "checked", unchecked: () => "unchecked" },
          ),
          h(VText, {}, () => "Mini Slots"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, loading: true, size: "small" }, {}),
          h(VText, {}, () => "Loading Mini"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, loading: true }, {}),
          h(VText, {}, () => "Loading"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, loading: true, modelValue: true }, {}),
          h(VText, {}, () => "Loading checked"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, disabled: true, modelValue: false }, {}),
          h(VText, {}, () => "Disabled"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args, disabled: true, modelValue: true }, {}),
          h(VText, {}, () => "Disabled Active"),
        ]),
        h("div", { style: { display: "flex", gap: "10px" } }, [
          h(VSwitch, { ...args }, { checked: () => "checked", unchecked: () => "unchecked" }),
          h(VText, {}, () => "Slots"),
        ]),
      ]);
    },
  }),
  args: {},
};
