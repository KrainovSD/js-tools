/* eslint-disable prefer-template */
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VText } from "../ui";

const meta = {
  title: "Components/Text",
  component: VText,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VText>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VText> = (args) => ({
  components: { VText },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", maxWidth: "400px" } }, [
      h(
        VText,
        { ...args },
        {
          default: () =>
            Array.from({ length: 10 }, () => "Длинный текст ограниченный контейнером.").join(" "),
        },
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: () => ({
    components: { VText },
    setup() {
      return {};
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { nowrap: true },
            {
              default: () =>
                "[No wrap] " +
                Array.from({ length: 2 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { ellipsis: true },
            {
              default: () =>
                "[Ellipsis] " +
                Array.from({ length: 10 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { rows: 3 },
            {
              default: () =>
                "[Rows-3] " +
                Array.from({ length: 10 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { weight: 600 },
            {
              default: () =>
                "[Weight 600] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { size: 24, ellipsis: true },
            {
              default: () =>
                "[Size 24] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { size: "sm", ellipsis: true },
            {
              default: () =>
                "[Size sm] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { italic: true, ellipsis: true },
            {
              default: () =>
                "[Italic] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { strong: true, ellipsis: true },
            {
              default: () =>
                "[Strong] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { underline: true, ellipsis: true },
            {
              default: () =>
                "[Underline] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { delete: true, ellipsis: true },
            {
              default: () =>
                "[Delete] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { disabled: true, ellipsis: true },
            {
              default: () =>
                "[Disabled] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { type: "secondary", ellipsis: true },
            {
              default: () =>
                "[Secondary] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { type: "success", ellipsis: true },
            {
              default: () =>
                "[Success] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { type: "warning", ellipsis: true },
            {
              default: () =>
                "[Warning] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
        h("div", { style: { display: "flex", maxWidth: "400px" } }, [
          h(
            VText,
            { type: "error", ellipsis: true },
            {
              default: () =>
                "[Error] " +
                Array.from({ length: 1 }, () => "Длинный текст ограниченный контейнером.").join(
                  " ",
                ),
            },
          ),
        ]),
      ]);
    },
  }),
  args: {},
};
