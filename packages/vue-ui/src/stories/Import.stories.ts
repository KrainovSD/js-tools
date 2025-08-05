import type { Meta, StoryFn } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VImport } from "../ui";

const meta = {
  title: "Components/Import",
  component: VImport,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VImport>;

export default meta;

const Template: StoryFn<typeof VImport> = (args) => ({
  components: { VImport },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VImport,
        {
          ...args,
          multiple: true,
          onUpload: (files, event) => {
            // eslint-disable-next-line no-console
            console.log(files, event);
          },
        },
        () => h(VButton, {}, () => "Import"),
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};
