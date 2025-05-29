import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VRadio } from "../ui";

const meta = {
  title: "Components/Radio",
  component: VRadio,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VRadio> = (args) => ({
  components: { VRadio },
  setup() {
    const value = ref(null);

    return { args, value };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VRadio,
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
        VRadio,
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
    components: { VRadio },
    setup() {
      const value = ref(null);

      return { args, value };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VRadio,
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
          VRadio,
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
          VRadio,
          { ...args, modelValue: this.value, value: 3, disabled: true },
          () => "Выбрать значение 3",
        ),
        h(VRadio, { ...args, modelValue: 5, value: 5, disabled: true }, () => "Выбрать значение 4"),
      ]);
    },
  }),
  args: {
    name: "stories",
    value: 0,
  },
};
