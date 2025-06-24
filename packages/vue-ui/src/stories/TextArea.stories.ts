import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VTextArea } from "../ui";

const meta = {
  title: "Components/TextArea",
  component: VTextArea,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VTextArea> = (args) => ({
  components: { VTextArea },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VTextArea, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VTextArea },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "50px" } }, [
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "400px" } },
          [
            h(VTextArea, { placeholder: "AutoSize empty", autoSize: true }),
            h(VTextArea, {
              modelValue:
                "Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content Inner Content ",
              placeholder: "AutoSize filled",
              autoSize: true,
            }),
            h(VTextArea, { placeholder: "Disabled with placeholder", disabled: true, rows: 3 }),
            h(VTextArea, {
              modelValue: "Disabled with content",
              placeholder: "Disabled",
              disabled: true,
              rows: 3,
            }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "400px" } },
          [
            h(VTextArea, { placeholder: "Outlined", variant: "outlined", rows: 3 }),
            h(VTextArea, {
              placeholder: "Filled",
              variant: "filled",
              rows: 3,
            }),
            h(VTextArea, {
              placeholder: "Borderless",
              variant: "borderless",
              rows: 3,
            }),
            h(VTextArea, {
              placeholder: "Underline",
              variant: "underline",
              rows: 3,
            }),
            h(VTextArea, { placeholder: "Small", size: "small", rows: 3 }),
            h(VTextArea, { placeholder: "Large", size: "large", rows: 3 }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "20px", width: "400px" } },
          [
            h(VTextArea, { placeholder: "Resize Vertical", resize: "vertical", rows: 3 }),
            h(VTextArea, { placeholder: "Resize Horizontal", resize: "horizontal", rows: 3 }),
            h(VTextArea, { placeholder: "Resize Both", resize: "both", rows: 3 }),
            h(VTextArea, { placeholder: "Rows 5", rows: 5 }),
            h(VTextArea, { placeholder: "Max Length 5", maxLength: 5, rows: 3 }),
          ],
        ),
      ]);
    },
  }),
  args: {},
};
