import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VUserAvatar } from "../ui";

const meta = {
  title: "Components/UserAvatar",
  component: VUserAvatar,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VUserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VUserAvatar> = (args) => ({
  components: { VUserAvatar },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VUserAvatar, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  name: "Full Name",
  avatar: undefined,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VUserAvatar },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VUserAvatar, { ...args }),
        h(VUserAvatar, { ...args, size: "lg" }),
        h(VUserAvatar, { ...args, size: "sm" }),
      ]);
    },
  }),
  args: {
    name: "Full Name",
    avatar: undefined,
  },
};
