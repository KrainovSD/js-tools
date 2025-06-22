import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import ButtonNotification from "../tech/ButtonNotification.vue";
import { VNotification } from "../ui";

const meta = {
  title: "Components/Notification",
  component: VNotification,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VNotification> = (args) => ({
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VNotification, { ...args }, () =>
        h(
          "div",
          {
            style: {
              display: "flex",
              gap: "20px",
              paddingBlockStart: "300px",
            },
          },
          [h(ButtonNotification, { type: "success" }, () => "Success")],
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
        h(VNotification, { ...args }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Top-Right",

              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
        h(VNotification, { ...args, position: "top-left" }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Top-Left",
              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
        h(VNotification, { ...args, position: "top" }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Top",
              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
        h(VNotification, { ...args, position: "bottom-right" }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Bottom-Right",
              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
        h(VNotification, { ...args, position: "bottom-left" }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Bottom-Left",
              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
        h(VNotification, { ...args, position: "bottom" }, () =>
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "20px",
                alignItems: "center",
              },
            },
            [
              "Bottom",
              h(ButtonNotification, { type: "success" }, () => "Success"),
              h(ButtonNotification, { type: "warning" }, () => "Warning"),
              h(ButtonNotification, { type: "error" }, () => "Error"),
              h(ButtonNotification, { type: "info" }, () => "Info"),
              h(ButtonNotification, { type: "loading" }, () => "Loading"),
              h(ButtonNotification, { type: "default" }, () => "Default"),
              h(ButtonNotification, { type: "confirm" }, () => "Confirm"),
              h(ButtonNotification, { process: true }, () => "Process"),
              h(ButtonNotification, { type: "success", big: true }, () => "Big"),
            ],
          ),
        ),
      ]);
    },
  }),
  args: {},
};
