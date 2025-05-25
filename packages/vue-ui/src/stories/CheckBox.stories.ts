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
    const checked = ref(false);

    function onChange(check: boolean) {
      checked.value = check;
    }

    return { args, checked, onChange };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VCheckBox,
        { ...args, checked: this.checked, onChange: this.onChange },
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

      function onChange(check: boolean) {
        checked.value = check;
      }
      function onChangeSecond(check: boolean) {
        checkedSecond.value = check;
      }
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
        onChangeSecond,
        onChangeThird,
        onChange,
      };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VCheckBox,
          {
            checked: this.checkedThird,
            onChange: this.onChangeThird,
            indeterminate: this.indeterminate,
          },
          () => "Выбрать Оба",
        ),
        h(
          VCheckBox,
          { checked: this.checkedSecond, onChange: this.onChangeSecond },
          () => "Выбрать значение 1",
        ),
        h(
          VCheckBox,
          { checked: this.checked, onChange: this.onChange, block: true },
          () => "Выбрать значение 2",
        ),
        h(VCheckBox, { checked: true, disabled: true }, () => "Disabled checked"),
        h(VCheckBox, { checked: false, disabled: true }, () => "Disabled unchecked"),
      ]);
    },
  }),
  args: { checked: false },
};
