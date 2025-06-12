import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VDivider, VPopper, VText } from "../ui";

const meta = {
  title: "Components/Popper",
  component: VPopper,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPopper>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VPopper> = (args) => ({
  components: { VPopper },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VPopper,
        { ...args },
        {
          default: () => h(VText, { fit: true, ellipsis: true }, () => "Текст для поппера"),
          content: () => "Test",
        },
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VPopper },
    setup() {
      const contentInteractive = (className: string) => [
        h(VText, { class: className }, () => "Пункт 1"),
        h(VText, { class: className }, () => "Пункт 2"),
        h(VText, { class: className }, () => "Пункт 3"),
        h(VDivider, {}),
        h(VText, { class: className }, () => "Пункт 4"),
      ];

      return { args, contentInteractive };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VPopper,
          { ...args },
          {
            default: () => h(VButton, {}, () => "DropDown"),
            content: () => this.contentInteractive,
          },
        ),
      ]);
    },
  }),
  args: {},
};
