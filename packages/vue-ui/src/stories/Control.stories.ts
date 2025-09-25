import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VControl } from "../ui";

const meta = {
  title: "Components/VControl",
  component: VControl,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VControl> = (args) => ({
  components: { VControl },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VControl, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VControl },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VControl,
          { ...args, info: { component: "text", props: { allowClear: true } } },
          () => "Выбрать значение",
        ),
      ]);
    },
  }),
  args: {
    info: { component: "select", props: { options: [] } },
  },
};
