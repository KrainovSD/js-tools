import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VPagination } from "../ui";

const meta = {
  title: "Components/Pagination",
  component: VPagination,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VPagination> = (args) => ({
  components: { VPagination },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VPagination, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  totalRows: 1000,
  pageSizes: [25, 50, 200, 500],
  showQuickJumper: true,
  showLastsPages: true,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VPagination },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "50px" } }, [
        h(VPagination, { ...args, size: "small" }),
        h(VPagination, { ...args, size: "default" }),
        h(VPagination, { ...args, placement: "center" }),
        h(VPagination, { ...args, placement: "right" }),
      ]);
    },
  }),
  args: {
    totalRows: 1000,
    pageSizes: [25, 50, 200],
  },
};
