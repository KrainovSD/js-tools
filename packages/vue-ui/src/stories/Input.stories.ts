import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VSettingsFilledIcon } from "../icons";
import { VInput } from "../ui";

const meta = {
  title: "Components/Input",
  component: VInput,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VInput> = (args) => ({
  components: { VInput },
  setup() {
    return { args };
  },
  render() {
    return h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" } },
      [h(VInput, { ...args })],
    );
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VInput, VSettingsFilledIcon },
    setup() {
      const value = ref("");

      return { args, value };
    },
    render() {
      return h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" } },
        [
          h(VInput, {
            modelValue: this.value,
            onInput: (event: InputEvent) => {
              this.value = (event.target as HTMLInputElement).value;
            },
            placeholder: "Outlined",
            variant: "outlined",
          }),
          h(VInput, { placeholder: "Filled", variant: "filled" }),
          h(VInput, { placeholder: "Borderless", variant: "borderless" }),
          h(VInput, { placeholder: "Underline", variant: "underline" }),
          h(VInput, { placeholder: "Small", size: "small" }),
          h(VInput, { placeholder: "Large", size: "large" }),
          h(
            VInput,
            { placeholder: "Prefix and Suffix", class: "test" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(VInput, {
            placeholder: "Clear",
            allowClear: true,
            modelValue: this.value,
            "onUpdate:modelValue": (newValue) => {
              this.value = newValue;
            },
          }),
          h(VInput, { placeholder: "Outlined disabled", variant: "outlined", disabled: true }),
          h(VInput, { placeholder: "Filled disabled", variant: "filled", disabled: true }),
          h(VInput, { placeholder: "Borderless disabled", variant: "borderless", disabled: true }),
          h(VInput, { placeholder: "Underline disabled", variant: "underline", disabled: true }),
          h(
            VInput,
            { placeholder: "Outlined error", variant: "outlined", status: "error" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Filled error", variant: "filled", status: "error" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Borderless error", variant: "borderless", status: "error" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Underline error", variant: "underline", status: "error" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Outlined warning", variant: "outlined", status: "warning" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Filled warning", variant: "filled", status: "warning" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Borderless warning",
              variant: "borderless",
              status: "warning",
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Underline warning", variant: "underline", status: "warning" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Outlined success", variant: "outlined", status: "success" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Filled success", variant: "filled", status: "success" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Borderless success",
              variant: "borderless",
              status: "success",
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            { placeholder: "Underline success", variant: "underline", status: "success" },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Outlined error disabled",
              variant: "outlined",
              status: "error",
              disabled: true,
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Filled error disabled",
              variant: "filled",
              status: "error",
              disabled: true,
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Borderless error disabled",
              variant: "borderless",
              status: "error",
              disabled: true,
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
          h(
            VInput,
            {
              placeholder: "Underline error disabled",
              variant: "underline",
              status: "error",
              disabled: true,
            },
            {
              prefix: () => h(VSettingsFilledIcon, { size: 16 }),
              suffix: () => h(VSettingsFilledIcon, { size: 16 }),
            },
          ),
        ],
      );
    },
  }),
  args: {},
};
