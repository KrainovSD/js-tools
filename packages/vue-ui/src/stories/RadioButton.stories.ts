import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VRadioButton } from "../ui";

const meta = {
  title: "Components/RadioButton",
  component: VRadioButton,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VRadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VRadioButton> = (args) => ({
  components: { VRadioButton },
  setup() {
    const value = ref(null);

    return { args, value };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VRadioButton,
        {
          ...args,
          modelValue: this.value,
          "onUpdate:modelValue": (value) => {
            this.value = value;
          },
          value: 1,
        },
        () => "Выбрать значение 1",
      ),
      h(
        VRadioButton,
        {
          ...args,
          modelValue: this.value,
          "onUpdate:modelValue": (value) => {
            this.value = value;
          },
          value: 2,
        },
        () => "Выбрать значение 2",
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  name: "stories",
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VRadioButton },
    setup() {
      const value = ref(null);

      return { args, value };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h("div", {}, [
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 1,
              position: "left",
            },
            () => "Выбрать значение 1",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 2,
            },
            () => "Выбрать значение 2",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 3,
              disabled: true,
              buttonStyle: "outline",
            },
            () => "Выбрать значение 3",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 4,
              position: "right",
              buttonStyle: "outline",
            },
            () => "Выбрать значение 4",
          ),
        ]),
        h("div", {}, [
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 1,
              position: "left",
              buttonStyle: "solid",
            },
            () => "Выбрать значение 1",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              buttonStyle: "solid",
              value: 2,
            },
            () => "Выбрать значение 2",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 3,
              disabled: true,
              buttonStyle: "solid",
            },
            () => "Выбрать значение 3",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 4,
              position: "right",
              buttonStyle: "solid",
            },
            () => "Выбрать значение 4",
          ),
        ]),
        h("div", {}, [
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 1,
              position: "left",
              buttonStyle: "solid",
              size: "small",
            },
            () => "Выбрать значение 1",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              buttonStyle: "solid",
              value: 2,
              size: "small",
            },
            () => "Выбрать значение 2",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 3,
              disabled: true,
              buttonStyle: "solid",
              size: "small",
            },
            () => "Выбрать значение 3",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 4,
              position: "right",
              buttonStyle: "solid",
              size: "small",
            },
            () => "Выбрать значение 4",
          ),
        ]),
        h("div", {}, [
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 1,
              position: "left",
              buttonStyle: "solid",
              size: "large",
            },
            () => "Выбрать значение 1",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              buttonStyle: "solid",
              value: 2,
              size: "large",
            },
            () => "Выбрать значение 2",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 3,
              disabled: true,
              buttonStyle: "solid",
              size: "large",
            },
            () => "Выбрать значение 3",
          ),
          h(
            VRadioButton,
            {
              ...args,
              modelValue: this.value,
              "onUpdate:modelValue": (value) => {
                this.value = value;
              },
              value: 4,
              position: "right",
              buttonStyle: "solid",
              size: "large",
            },
            () => "Выбрать значение 4",
          ),
        ]),
      ]);
    },
  }),
  args: {
    name: "stories",
    value: 0,
  },
};
