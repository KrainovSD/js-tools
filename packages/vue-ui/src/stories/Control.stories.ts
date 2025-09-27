import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VControl } from "../ui";

const meta = {
  title: "Components/Control",
  component: VControl,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VControl> = (args) => ({
  components: { VControl },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VControl, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = { component: "text" };

export const AllInOne: Story = {
  render: (args) => ({
    components: { VControl },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VControl, {
          ...args,
          component: "text",
          props: { placeholder: "Имя поля", allowClear: true },
        }),
        h(VControl, { ...args, component: "number", props: { min: -5, max: 5 } }),
        h(VControl, { ...args, component: "number-range", props: {} }),
        h(VControl, {
          ...args,
          component: "select",
          props: {
            options: [
              { label: "Тип 1", value: 1 },
              { label: "Тип 2", value: 2 },
              { label: "Тип 3", value: 3 },
              { label: "Тип 4", value: 4 },
            ],
            clear: true,
            multiple: true,
            placeholder: "Выберите тип",
            search: true,
          },
        }),
        h(VControl, { ...args, component: "date", props: {} }),
        h(VControl, { ...args, component: "date-range", props: {} }),
      ]);
    },
  }),
  args: {
    component: "text",
  },
};
