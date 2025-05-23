import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VSettingsFilledIcon } from "../icons";
import { VButton } from "../ui";

const meta = {
  title: "Example/Button",
  component: VButton,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VButton> = (args) => ({
  components: { VButton },
  setup() {
    return { args };
  },
  render: () => h(VButton, { ...args }, { default: () => "Кнопка" }),
});

export const Primary = Template.bind({});
Primary.args = {
  type: "primary",
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VButton },
    setup() {
      function onClick() {
        // eslint-disable-next-line no-console
        console.log("click");
      }

      return { args, onClick };
    },
    render: () =>
      h("div", { style: { display: "flex", gap: "20px" } }, [
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Type"),
            h(VButton, { type: "default" }, { default: () => "Default" }),
            h(VButton, { type: "dashed" }, { default: () => "Dashed" }),
            h(VButton, { type: "primary" }, { default: () => "Primary" }),
            h(VButton, { type: "text" }, { default: () => "Text" }),
            h(VButton, { type: "link" }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#272727FF",
              padding: "10px",
            },
          },
          [
            h("span", { style: { marginBottom: "10px", color: "#ffffff" } }, "Ghost"),
            h(VButton, { type: "default", ghost: true }, { default: () => "Default" }),
            h(VButton, { type: "dashed", ghost: true }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", ghost: true }, { default: () => "Primary" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Loading"),
            h(
              VButton,
              { type: "default", loading: true, iconPosition: "right" },
              { default: () => "Default" },
            ),
            h(VButton, { type: "dashed", loading: true }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", loading: true }, { default: () => "Primary" }),
            h(VButton, { type: "text", loading: true }, { default: () => "Text" }),
            h(VButton, { type: "link", loading: true }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Small"),
            h(VButton, { type: "default", size: "small" }, { default: () => "Default" }),
            h(VButton, { type: "dashed", size: "small" }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", size: "small" }, { default: () => "Primary" }),
            h(VButton, { type: "text", size: "small" }, { default: () => "Text" }),
            h(VButton, { type: "link", size: "small" }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Large"),
            h(VButton, { type: "default", size: "large" }, { default: () => "Default" }),
            h(VButton, { type: "dashed", size: "large" }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", size: "large" }, { default: () => "Primary" }),
            h(VButton, { type: "text", size: "large" }, { default: () => "Text" }),
            h(VButton, { type: "link", size: "large" }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Danger"),
            h(VButton, { type: "default", danger: true }, { default: () => "Default" }),
            h(VButton, { type: "dashed", danger: true }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", danger: true }, { default: () => "Primary" }),
            h(VButton, { type: "text", danger: true }, { default: () => "Text" }),
            h(VButton, { type: "link", danger: true }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Disabled"),
            h(VButton, { type: "default", disabled: true }, { default: () => "Default" }),
            h(VButton, { type: "dashed", disabled: true }, { default: () => "Dashed" }),
            h(VButton, { type: "primary", disabled: true }, { default: () => "Primary" }),
            h(VButton, { type: "text", disabled: true }, { default: () => "Text" }),
            h(VButton, { type: "link", disabled: true }, { default: () => "Link" }),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" } },
          [
            h("span", { style: { marginBottom: "10px" } }, "Shape"),
            h(VButton, { type: "default", shape: "round" }, { default: () => "Default" }),
            h(
              VButton,
              { type: "dashed", shape: "round" },
              { default: () => "Dashed", icon: () => h(VSettingsFilledIcon, { size: 14 }) },
            ),
            h(
              VButton,
              { type: "dashed", shape: "default", iconPosition: "right" },
              { default: () => "Dashed", icon: () => h(VSettingsFilledIcon, { size: 14 }) },
            ),
            h(
              VButton,
              { type: "primary", shape: "circle" },
              { icon: () => h(VSettingsFilledIcon, { size: 14 }) },
            ),
            h(
              VButton,
              { type: "primary", shape: "default" },
              { icon: () => h(VSettingsFilledIcon, { size: 14 }) },
            ),
          ],
        ),
      ]),
  }),
  args: {},
};
