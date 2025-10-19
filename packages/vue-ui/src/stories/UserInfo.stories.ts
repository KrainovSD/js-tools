import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VUserInfo } from "../ui";

const meta = {
  title: "Components/UserInfo",
  component: VUserInfo,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VUserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VUserInfo> = (args) => ({
  components: { VUserInfo },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VUserInfo, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = { name: "Full Name", username: "username" };

export const AllInOne: Story = {
  render: (args) => ({
    components: { VUserInfo },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VUserInfo, { ...args }),
        h(VUserInfo, { ...args, size: "large" }),
        h(VUserInfo, { ...args, size: "small" }),
      ]);
    },
  }),
  args: {
    name: "Full Name",
    username: "username",
  },
};
