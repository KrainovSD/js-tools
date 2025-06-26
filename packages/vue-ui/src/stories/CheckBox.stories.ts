import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { computed, h, ref } from "vue";
import { VCheckBox } from "../ui";

const meta = {
  title: "Components/CheckBox",
  component: VCheckBox,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VCheckBox> = (args) => ({
  components: { VCheckBox },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VCheckBox,

        { ...args },
        () => "Выбрать значение",
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VCheckBox },
    setup() {
      const checked = ref(false);
      const checkedSecond = ref(false);
      const checkedThird = computed(() => checked.value && checkedSecond.value);
      const indeterminate = computed(
        () => !checkedThird.value && (checked.value || checkedSecond.value),
      );

      function onChangeThird(check: boolean) {
        checkedSecond.value = check;
        checked.value = check;
      }

      return {
        args,
        checked,
        checkedSecond,
        checkedThird,
        indeterminate,
        onChangeThird,
      };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VCheckBox,
          {
            modelValue: this.checkedThird,
            "onUpdate:modelValue": this.onChangeThird,
            indeterminate: this.indeterminate,
          },
          () => "Выбрать Оба",
        ),
        h(
          VCheckBox,
          {
            modelValue: this.checkedSecond,
            "onUpdate:modelValue": (newValue) => {
              this.checkedSecond = newValue;
            },
          },
          () => "Выбрать значение 1",
        ),
        h(
          VCheckBox,
          {
            block: true,
            modelValue: this.checked,
            "onUpdate:modelValue": (newValue) => {
              this.checked = newValue;
            },
          },
          () => "Выбрать значение 2",
        ),
        h(
          VCheckBox,
          {
            disabled: true,
            modelValue: false,
          },
          () => "Disabled checked",
        ),
        h(
          VCheckBox,
          {
            disabled: true,
            modelValue: true,
          },
          () => "Disabled unchecked",
        ),
      ]);
    },
  }),
  args: {},
};
