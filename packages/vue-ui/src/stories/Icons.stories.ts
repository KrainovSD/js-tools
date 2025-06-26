import * as IconsLibrary from "@krainovsd/vue-icons";
import type { Meta, StoryFn } from "@storybook/vue3";
import { h, ref } from "vue";
import { VButton, VInput } from "../ui";

const FIRST_ICON = Object.values(IconsLibrary)[0];

const meta = {
  title: "Components/Icons",
  component: FIRST_ICON,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof FIRST_ICON>;

export default meta;

const Template: StoryFn<typeof FIRST_ICON> = (args) => ({
  components: {},
  setup() {
    const search = ref("");

    function copyToClipboard(textToCopy: string) {
      if (navigator.clipboard != undefined && window.isSecureContext) {
        return navigator.clipboard.writeText(textToCopy);
      }

      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise<void>((res, rej) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-deprecated
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }

    return { args, search, copyToClipboard };
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflow: "hidden",
          maxHeight: "calc(100vh - 30px)",
        },
      },
      [
        h(VInput, {
          modelValue: this.search,
          "onUpdate:modelValue": (value) => {
            this.search = value;
          },
        }),
        h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", overflow: "auto" } }, [
          Object.entries(IconsLibrary).map(([name, icon]) => {
            if (!name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())) return null;

            return h(
              VButton,
              {
                onClick: () => this.copyToClipboard(name),
                style: { flexDirection: "column", height: "fit-content", paddingBlock: "5px" },
              },
              { default: () => name, icon: () => h(icon, { size: 24 }) },
            );
          }),
        ]),
      ],
    );
  },
});

export const Primary = Template.bind({});
Primary.args = {};
