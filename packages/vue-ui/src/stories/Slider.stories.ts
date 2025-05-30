import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VSlider } from "../ui";

const meta = {
  title: "Components/Slider",
  component: VSlider,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VSlider> = (args) => ({
  components: { VSlider },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VSlider, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VSlider },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VSlider, { ...args }),
      ]);
    },
  }),
  args: {},
};
