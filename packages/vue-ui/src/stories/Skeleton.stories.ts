import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VSkeleton, VText } from "../ui";

const meta = {
  title: "Components/Skeleton",
  component: VSkeleton,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VSkeleton> = (args) => ({
  components: { VSkeleton },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VSkeleton, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VSkeleton },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "20px" } }, [
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Button"),
            h(VSkeleton, { ...args, type: "button" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Button Small"),
            h(VSkeleton, { ...args, type: "button", size: "small" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Button Large"),
            h(VSkeleton, { ...args, type: "button", size: "large" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Button Round"),
            h(VSkeleton, { ...args, type: "button", shape: "round" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Button Circle"),
            h(VSkeleton, { ...args, type: "button", shape: "circle" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Title"),
            h(VSkeleton, { ...args, type: "title", style: { flex: "1" } }),
          ]),
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                align: "center",
                width: "200px",
              },
            },
            [
              h(VText, {}, () => "Text"),
              h(VSkeleton, { ...args, type: "text", style: { flex: "1" } }),
            ],
          ),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Input"),
            h(VSkeleton, { ...args, type: "input" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Input Small"),
            h(VSkeleton, { ...args, type: "input", size: "small" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Input Large"),
            h(VSkeleton, { ...args, type: "input", size: "large" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Avatar Round"),
            h(VSkeleton, { ...args, type: "avatar", shape: "round" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Avatar Circle"),
            h(VSkeleton, { ...args, type: "avatar", shape: "circle" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Avatar Small"),
            h(VSkeleton, { ...args, type: "avatar", size: "small" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Avatar Large"),
            h(VSkeleton, { ...args, type: "avatar", size: "large" }),
          ]),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Image"),
            h(VSkeleton, { ...args, type: "image" }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Custom Image"),
            h(VSkeleton, { ...args, type: "image", width: 200, height: 100, style: { flex: "1" } }),
          ]),
          h("div", { style: { display: "flex", gap: "20px", width: "100%", align: "center" } }, [
            h(VText, {}, () => "Default"),
            h(VSkeleton, { ...args, type: "default", width: 300, height: 300 }),
          ]),
        ]),
      ]);
    },
  }),
  args: {},
};
