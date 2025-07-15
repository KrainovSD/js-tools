import type { Meta, StoryFn } from "@storybook/vue3";
import { h } from "vue";
import { VEmpty } from "../ui";

const meta = {
  title: "Components/Empty",
  component: VEmpty,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VEmpty>;

export default meta;

const Template: StoryFn<typeof VEmpty> = (args) => ({
  components: { VEmpty },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VEmpty, { ...args }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};
