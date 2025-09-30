import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { type Tab, VTabs } from "../ui";

const meta = {
  title: "Components/Tabs",
  component: VTabs,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const TABS: Tab[] = [
  { id: 0, label: "Tab 1" },
  { id: 1, label: "Tab 2" },
  { id: 2, label: "Tab 3" },
  { id: 3, label: "Tab 4" },
];

const Template: StoryFn<typeof VTabs> = (args) => ({
  components: { VTabs },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VTabs, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  tabs: TABS,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VTabs },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VTabs, { ...args }, () => "Выбрать значение"),
      ]);
    },
  }),
  args: {
    tabs: TABS,
  },
};
