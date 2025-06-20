import { VSettingFilled } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VPassword } from "../ui";

const meta = {
  title: "Components/Password",
  component: VPassword,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VPassword> = (args) => ({
  components: { VPassword },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VPassword, {
        ...args,
      }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VPassword },
    setup() {
      const value = ref("");

      return { args, value };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VPassword, {
          modelValue: this.value,
          onInput: (event: InputEvent) => {
            this.value = (event.target as HTMLInputElement).value;
          },
          placeholder: "Outlined",
          variant: "outlined",
          checked: true,
        }),
        h(VPassword, { placeholder: "Filled", variant: "filled" }),
        h(VPassword, { placeholder: "Borderless", variant: "borderless", status: "error" }),
        h(
          VPassword,
          { placeholder: "Underline", variant: "underline" },
          {
            suffix: () => h(VSettingFilled, { size: 16 }),
            prefix: () => h(VSettingFilled, { size: 16 }),
          },
        ),
      ]);
    },
  }),
  args: {},
};
