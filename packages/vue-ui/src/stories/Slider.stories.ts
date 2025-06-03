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
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "400px",
          marginLeft: "50px",
        },
      },
      [h(VSlider, { ...args })],
    );
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
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "400px",
            marginLeft: "50px",
          },
        },
        [
          h(VSlider, { min: 0, max: 100, modelValue: 12, step: 1 }),
          h(VSlider, { min: 0, max: 100, modelValue: 16, step: 10 }),
          h(VSlider, { min: 0, max: 100, modelValue: 24, step: 1, disabled: true }),
          h(VSlider, { min: 0, max: 100, modelValue: [10, 30], step: 1, range: true }),
          h(VSlider, { min: 0, max: 100, modelValue: [24, 65], step: 1, range: true }),
          h(VSlider, {
            min: 0,
            max: 100,
            modelValue: [5, 78],
            step: 1,
            range: true,
            disabled: true,
          }),
        ],
      );
    },
  }),
  args: {},
};
