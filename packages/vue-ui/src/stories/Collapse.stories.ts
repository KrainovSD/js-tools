import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VCollapse } from "../ui";

const meta = {
  title: "Components/Collapse",
  component: VCollapse,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VCollapse>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VCollapse> = (args) => ({
  components: { VCollapse },
  setup() {
    return { args };
  },
  render: () =>
    h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VCollapse, { ...args }, { default: () => "Содержимое" }),
    ]),
});

export const Primary = Template.bind({});
Primary.args = {
  header: "Заголовок",
  initialOpen: true,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VCollapse },
    setup() {
      return { args };
    },
    render: () =>
      h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(
          VCollapse,
          { initialOpen: false, size: "small", header: "small" },
          {
            default: () => [
              h(VButton, {}, () => "Кнопка"),
              h(VButton, {}, () => "Кнопка"),
              h(VButton, {}, () => "Кнопка"),
            ],
          },
        ),
        h(
          VCollapse,
          { initialOpen: true, size: "default", header: "default" },
          { default: () => "Содержимое" },
        ),
        h(
          VCollapse,
          { initialOpen: true, size: "large", header: "large" },
          { default: () => "Содержимое" },
        ),
        h(
          VCollapse,
          { initialOpen: true, ghost: true, header: "ghost" },
          { default: () => "Содержимое" },
        ),
        h(
          VCollapse,
          { initialOpen: true, borderless: true, header: "borderless" },
          { default: () => "Содержимое" },
        ),
      ]),
  }),
  args: { initialOpen: true, header: "Header" },
};
