import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VLoader } from "../ui";

const meta = {
  title: "Components/Loader",
  component: VLoader,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VLoader> = (args) => ({
  components: { VLoader },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VLoader, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  type: "primary",
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VLoader },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        { style: { display: "flex", width: "100%", justifyContent: "space-between" } },
        [
          h("div", { style: { display: "flex", flexDirection: "column", gap: "50px" } }, [
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args }),
            ),
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args, type: "secondary" }),
            ),
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args, type: "tertiary" }),
            ),
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args, type: "quaternary" }),
            ),
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args, type: "quinary" }),
            ),
          ]),
          h("div", { style: { display: "flex", flexDirection: "column", gap: "50px" } }, [
            h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  border: "1px solid var(--ksd-border-color)",
                },
              },
              h(VLoader, { ...args, type: "senary" }),
            ),
          ]),
        ],
      );
    },
  }),
  args: {},
};
