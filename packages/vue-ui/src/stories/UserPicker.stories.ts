import { randomString } from "@krainovsd/js-helpers";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import { type User, type UserPickerProps, VUserPicker } from "../ui";

const meta = {
  title: "Components/UserPicker",
  component: VUserPicker as unknown as DefineComponent<UserPickerProps<true>>,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VUserPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const USERS = Array.from<unknown, User>({ length: 30 }, (_, i) => ({
  id: i,
  name: randomString(10),
  username: `user_${i}`,
}));

const Template: StoryFn<typeof VUserPicker> = (args) => ({
  components: { VUserPicker },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VUserPicker, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  users: USERS,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VUserPicker },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VUserPicker, { ...args }),
        h(VUserPicker, { ...args, multiple: true, modelValue: [1, 6] }),
      ]);
    },
  }),
  args: {
    users: USERS,
  },
};
