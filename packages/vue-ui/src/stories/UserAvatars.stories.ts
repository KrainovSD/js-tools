import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { type UserAvatarsProps, VUserAvatars } from "../ui";

const meta = {
  title: "Components/UserAvatars",
  component: VUserAvatars,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VUserAvatars>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VUserAvatars> = (args) => ({
  components: { VUserAvatars },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VUserAvatars, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

const users: UserAvatarsProps["avatars"] = [
  { name: "Test" },
  { name: "Vest" },
  { name: "Guest" },
  { name: "Muest" },
];

export const Primary = Template.bind({});
Primary.args = {
  avatars: users,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VUserAvatars },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            width: "fit-content",
            height: "fit-content",
          },
        },
        [
          h(VUserAvatars, { ...args }),
          h(VUserAvatars, { ...args, size: "large" }),
          h(VUserAvatars, { ...args, size: "small" }),
          h(VUserAvatars, { ...args }),
        ],
      );
    },
  }),
  args: {
    avatars: users,
  },
};
