import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VSettingsFilledIcon } from "../icons";
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
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VInputNumber, {
        ...args,
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
      const value = ref("");

      return { args, value };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VInputNumber,
          {
            modelValue: this.value,
            onInput: (event: InputEvent) => {
              this.value = (event.target as HTMLInputElement).value;
            },
            placeholder: "Outlined",
            variant: "outlined",
            checked: true,
          },
          {
            suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            prefix: () => h(VSettingsFilledIcon, { size: 16 }),
            default: () => "text",
          },
        ),
        h(VInputNumber, {
          placeholder: "Outlined",
          variant: "outlined",
          disabled: true,
        }),
        h(VInputNumber, { placeholder: "Filled", variant: "filled" }),
        h(VInputNumber, { placeholder: "Borderless", variant: "borderless", status: "error" }),
        h(VInputNumber, { placeholder: "Underline", variant: "underline" }),
      ]);
    },
  }),
  args: {},
};
