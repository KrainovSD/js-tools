import { VSettingFilled } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VInputNumber } from "../ui";

const meta = {
  title: "Components/InputNumber",
  component: VInputNumber,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VInputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VInputNumber> = (args) => ({
  components: { VInputNumber },
  setup() {
    const value = ref(0);

    return { args, value };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VInputNumber, {
        ...args,
        modelValue: this.value,
      }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VInputNumber },
    setup() {
      const value = ref(0);

      return { args, value };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VInputNumber,
          {
            modelValue: this.value,
            placeholder: "Outlined",
            variant: "outlined",
            checked: true,
            step: 2,
            min: 50,
            max: 2,
          },
          {
            suffix: () => h(VSettingFilled, { size: 16 }),
            prefix: () => h(VSettingFilled, { size: 16 }),
            default: () => "text",
          },
        ),
        h(VInputNumber, {
          placeholder: "Outlined",
          variant: "outlined",
          disabled: true,
          modelValue: 1,
        }),
        h(VInputNumber, { placeholder: "Filled", variant: "filled", modelValue: 1 }),
        h(VInputNumber, {
          placeholder: "Borderless",
          variant: "borderless",
          modelValue: 1,
          status: "error",
        }),
        h(VInputNumber, { placeholder: "Underline", variant: "underline", modelValue: 1 }),
      ]);
    },
  }),
  args: {},
};
