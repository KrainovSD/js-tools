import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VColorPicker } from "../ui";

const meta = {
  title: "Components/ColorPicker",
  component: VColorPicker,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VColorPicker> = (args) => ({
  components: { VColorPicker },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VColorPicker, {
        ...args,
        "onUpdate:modelValue": (value) => {
          // eslint-disable-next-line no-console
          console.log("update", value);
        },
      }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VColorPicker },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VColorPicker, { ...args, size: "default" }),
        h(VColorPicker, { ...args, size: "small" }),
        h(VColorPicker, { ...args, size: "large" }),
      ]);
    },
  }),
  args: {},
};
