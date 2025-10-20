import { randomString } from "@krainovsd/js-helpers";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import { type SearchProps, type SelectItem, VSearch } from "../ui";

const meta = {
  title: "Components/Search",
  component: VSearch as unknown as DefineComponent<SearchProps<number | string>>,
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
  options: [
    {
      title: "first",
      options: Array.from<unknown, SelectItem<string | number>>({ length: 150 }, (_, i) => ({
        value: i,
        label: randomString(50),
      })),
    },
    {
      title: "second",
      options: Array.from<unknown, SelectItem<string | number>>({ length: 150 }, (_, i) => ({
        value: i,
        label: randomString(50),
      })),
    },
  ],
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
          h(VSearch, {
            ...args,
            // eslint-disable-next-line no-console
            onClick: (key) => console.log(key),
            placeholder: "Поиск",
            debounce: 120,
          }),
        ],
      );
    },
  }),
  args: {
    options: Array.from<unknown, SelectItem<string | number>>({ length: 30000 }, (_, i) => ({
      value: i,
      label: randomString(50),
    })),
  },
};
