import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import ButtonMessage from "../tech/ButtonMessage.vue";
import { VMessage } from "../ui";

const meta = {
  title: "Components/Message",
  component: VMessage,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VMessage> = (args) => ({
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VMessage, { ...args }, () =>
        h(
          "div",
          {
            style: {
              display: "flex",
              gap: "20px",
              paddingBlockStart: "300px",
            },
          },
          [h(ButtonMessage, { type: "success" }, () => "Success")],
        ),
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VMessage, { ...args, maxCount: 5 }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                paddingBlockStart: "300px",
              },
            },
            [
              h(ButtonMessage, { type: "success" }, () => "Success"),
              h(ButtonMessage, { type: "warning" }, () => "Warning"),
              h(ButtonMessage, { type: "error" }, () => "Error"),
              h(ButtonMessage, { type: "info" }, () => "Info"),
              h(ButtonMessage, { type: "loading" }, () => "Loading"),
              h(ButtonMessage, { process: true }, () => "Process"),
            ],
          ),
        ),
      ]);
    },
  }),
  args: {},
};
