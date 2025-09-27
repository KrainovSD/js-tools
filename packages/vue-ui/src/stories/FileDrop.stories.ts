import type { Meta, StoryFn } from "@storybook/vue3";
import { h } from "vue";
import { VFileDrop } from "../ui";

const meta = {
  title: "Components/FileDrop",
  component: VFileDrop,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VFileDrop>;

export default meta;

const Template: StoryFn<typeof VFileDrop> = (args) => ({
  components: { VFileDrop },
  setup() {
    return { args };
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "300px",
          height: "300px",
          border: "1px solid var(--ksd-border-color)",
        },
      },
      [
        h(
          VFileDrop,
          // eslint-disable-next-line no-console
          { ...args, onUpload: (value) => console.log(value) },
          { default: () => "Переместите файл", over: () => "Импорт файла" },
        ),
      ],
    );
  },
});

export const Primary = Template.bind({});
Primary.args = {};
