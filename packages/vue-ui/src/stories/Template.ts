import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VCheckBox } from "../ui";

const meta = {
  title: "Components/CheckBox",
  component: VCheckBox,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VCheckBox> = (args) => ({
  components: { VCheckBox },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VCheckBox, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VCheckBox },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VCheckBox, { ...args }, () => "Выбрать значение"),
      ]);
    },
  }),
  args: {},
};
