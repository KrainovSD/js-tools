import { randomString } from "@krainovsd/js-helpers";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VSearch } from "../ui";
import type { SearchOption } from "../ui/Search.vue";

const meta = {
  title: "Components/Search",
  component: VSearch,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VSearch> = (args) => ({
  components: { VSearch },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      // eslint-disable-next-line no-console
      h(VSearch, { ...args, onClick: (key) => console.log(key), placeholder: "Поиск" }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  options: Array.from<unknown, SearchOption>({ length: 300 }, (_, i) => ({
    key: i,
    label: randomString(50),
  })),
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VSearch },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        { options: undefined, style: { display: "flex", flexDirection: "column", gap: "20px" } },
        [
          h("span", {}, ["30000 items with length 50"]),
          // eslint-disable-next-line no-console
          h(VSearch, { ...args, onClick: (key) => console.log(key), placeholder: "Поиск" }),
        ],
      );
    },
  }),
  args: {
    options: Array.from<unknown, SearchOption>({ length: 30000 }, (_, i) => ({
      key: i,
      label: randomString(50),
    })),
  },
};
