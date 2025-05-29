import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VRadioGroup } from "../ui";

const meta = {
  title: "Components/RadioGroup",
  component: VRadioGroup,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VRadioGroup> = (args) => ({
  components: { VRadioGroup },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VRadioGroup, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  options: [
    { value: 1, label: "Значение 1" },
    { value: 2, label: "Значение 2" },
    { value: 3, label: "Значение 3" },
    { value: 4, label: "Значение 4", disabled: true },
    { value: 5, label: "Значение 5" },
  ],
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VRadioGroup },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h("div", {}, [h(VRadioGroup, { ...args })]),
        h("div", {}, [
          h(VRadioGroup, {
            ...args,
            optionType: "button",
            buttonStyle: "outline",
            size: "default",
          }),
        ]),
        h("div", {}, [
          h(VRadioGroup, {
            ...args,
            optionType: "button",
            buttonStyle: "solid",
            size: "default",
          }),
        ]),
        h("div", {}, [
          h(VRadioGroup, {
            ...args,
            optionType: "button",
            buttonStyle: "outline",
            size: "large",
          }),
        ]),
        h("div", {}, [
          h(VRadioGroup, {
            ...args,
            optionType: "button",
            buttonStyle: "outline",
            size: "small",
          }),
        ]),
      ]);
    },
  }),
  args: {
    options: [
      { value: 1, label: "Значение 1" },
      { value: 2, label: "Значение 2" },
      { value: 3, label: "Значение 3" },
      { value: 4, label: "Значение 4", disabled: true },
      { value: 5, label: "Значение 5" },
    ],
  },
};
