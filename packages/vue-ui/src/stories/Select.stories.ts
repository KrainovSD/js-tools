import { VSettingFilled } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import { type SelectProps, VSelect, VText } from "../ui";

const meta = {
  title: "Components/Select",
  component: VSelect as unknown as DefineComponent<SelectProps<false>>,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VSelect> = (args) => ({
  components: { VSelect },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VSelect, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  options: Array.from({ length: 100 }, (_, i) => ({ label: `Значение ${i}`, value: i })),
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VSelect },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "20px" } }, [
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "200px" } },
          [
            h(VSelect, { ...args, modelValue: undefined, placeholder: "Обычный" }),
            h(VSelect, {
              ...args,
              modelValue: "Test",
              placeholder: "Без очистки",
              clear: false,
            }),
            h(VSelect, { ...args, modelValue: "Test", placeholder: "С выбранным значением" }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Без поиска",
              search: false,
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Filled",
              variant: "filled",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Borderless",
              variant: "borderless",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline",
              variant: "underline",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Small",
              size: "small",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Large",
              size: "large",
            }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "200px" } },
          [
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Outline Error",
              variant: "outlined",
              status: "error",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Filled Error",
              variant: "filled",
              status: "error",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Borderless Error",
              variant: "borderless",
              status: "error",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline Error",
              variant: "underline",
              status: "error",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Outline Warning",
              variant: "outlined",
              status: "warning",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Filled Warning",
              variant: "filled",
              status: "warning",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Borderless Warning",
              variant: "borderless",
              status: "warning",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline Warning",
              variant: "underline",
              status: "warning",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Outline Success",
              variant: "outlined",
              status: "success",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Filled Success",
              variant: "filled",
              status: "success",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Borderless Success",
              variant: "borderless",
              status: "success",
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline Success",
              variant: "underline",
              status: "success",
            }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "400px" } },
          [
            h(VSelect, {
              ...args,
              modelValue: ["1", 2, 3, "4", 5],
              placeholder: "Outline Multiple",
              variant: "outlined",
              multiple: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 2, 3],
              placeholder: "Outline Multiple Small",
              variant: "outlined",
              multiple: true,
              size: "small",
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 2, 3],
              placeholder: "Outline Multiple Large",
              variant: "outlined",
              multiple: true,
              size: "large",
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 2, 3],
              placeholder: "Filled Multiple",
              variant: "filled",
              multiple: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Borderless Multiple",
              variant: "borderless",
              multiple: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline Multiple",
              variant: "underline",
              multiple: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 3],
              placeholder: "Outline Disabled",
              variant: "outlined",
              disabled: true,
              multiple: true,
            }),

            h(VSelect, {
              ...args,
              modelValue: 2,
              placeholder: "Filled Disabled",
              variant: "filled",
              disabled: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 3],
              placeholder: "Borderless Disabled",
              variant: "borderless",
              multiple: true,
              disabled: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: undefined,
              placeholder: "Underline Disabled",
              variant: "underline",
              disabled: true,
            }),
            h(VSelect, {
              ...args,
              modelValue: ["1", 3],
              placeholder: "Outline Loading",
              variant: "outlined",
              loading: true,
            }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "400px" } },
          [
            h(VSelect, {
              ...args,
              modelValue: ["1"],
              placeholder: "Grouped Multiple",
              variant: "outlined",
              multiple: true,
              options: [
                {
                  title: "firstGroup",
                  options: [
                    { value: "1", label: "Значение 1" },
                    { value: 2, label: "Значение 2" },
                    { value: 3, label: "Значение 3" },
                  ],
                },
                {
                  title: "secondGroup",
                  options: [
                    {
                      value: "4",
                      label: "Очень Длинное значение для проверки размеров у селектов 4",
                    },
                    {
                      value: 5,
                      label: "Значение 5",
                      desc: h(
                        "div",
                        { style: { display: "flex", gap: "10px", alignItems: "center" } },
                        [h(VSettingFilled, { size: 14 }), h(VText, {}, () => "Особое значение 5")],
                      ),
                    },
                  ],
                },
              ],
            }),
            h(VSelect, {
              ...args,
              modelValue: "1",
              placeholder: "Grouped single",
              variant: "outlined",
              multiple: false,
              options: [
                {
                  title: "firstGroup",
                  options: [
                    { value: "1", label: "Значение 1" },
                    { value: 2, label: "Значение 2" },
                    { value: 3, label: "Значение 3" },
                  ],
                },
                {
                  title: "secondGroup",
                  options: [
                    {
                      value: "4",
                      label: "Очень Длинное значение для проверки размеров у селектов 4",
                    },
                    {
                      value: 5,
                      label: "Значение 5",
                      desc: h(
                        "div",
                        { style: { display: "flex", gap: "10px", alignItems: "center" } },
                        [h(VSettingFilled, { size: 14 }), h(VText, {}, () => "Особое значение 5")],
                      ),
                    },
                  ],
                },
              ],
            }),
          ],
        ),
      ]);
    },
  }),
  args: {
    options: [
      { value: "1", label: "Значение 1" },
      { value: 2, label: "Значение 2" },
      { value: 3, label: "Значение 3" },
      { value: "4", label: "Очень Длинное значение для проверки размеров у селектов 4" },
      {
        value: 5,
        label: "Значение 5",
        desc: h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, [
          h(VSettingFilled, { size: 14 }),
          h(VText, {}, () => "Особое значение 5"),
        ]),
      },
    ],
  },
};
