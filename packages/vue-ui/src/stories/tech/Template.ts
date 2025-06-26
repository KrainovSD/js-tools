import type { Meta, StoryFn } from "@storybook/vue3";
import { h } from "vue";
import Empty from "../../tech/Empty.vue";
import { VModal } from "../../ui";

const meta = {
  title: "Tech/ModalWidthPopup",
  component: Empty,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Empty>;

export default meta;

const Template: StoryFn<typeof Empty> = () => ({
  setup() {
    return {};
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VModal, { header: "title" }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};
