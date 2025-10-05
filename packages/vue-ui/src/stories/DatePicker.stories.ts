/* eslint-disable no-console */
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import { type DatePickerProps, VDatePicker } from "../ui";

const meta = {
  title: "Components/DatePicker",
  component: VDatePicker as unknown as DefineComponent<DatePickerProps<false>>,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VDatePicker> = (args) => ({
  components: { VDatePicker },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VDatePicker, {
        ...args,
        "onUpdate:modelValue": (value) => {
          console.log("updated", value);
        },
      }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VDatePicker },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VDatePicker, {
          ...args,
          displayFormat: "ru-dot",
          "onUpdate:modelValue": (value) => {
            console.log("updated", value);
          },
        }),
        h(VDatePicker, {
          ...args,
          displayFormat: "ru-dot",
          multiple: true,
          "onUpdate:modelValue": (value) => {
            console.log("updated", value);
          },
        }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "ru-slash",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "iso",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "ru-dot",
        //   view: "months",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "ru-slash",
        //   view: "months",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "iso",
        //   view: "months",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "ru-dot",
        //   view: "years",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "ru-slash",
        //   view: "years",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   displayFormat: "iso",
        //   view: "years",
        //   modelValue: "2025-10-15",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   multiple: true,
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   multiple: true,
        //   size: "large",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   multiple: true,
        //   view: "months",
        //   outputFormat: "YYYY.MM",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
        // h(VDatePicker, {
        //   ...args,
        //   multiple: true,
        //   view: "years",
        //   outputFormat: "YYYY",
        //   "onUpdate:modelValue": (value) => {
        //     console.log("updated", value);
        //   },
        // }),
      ]);
    },
  }),
  args: {},
};
