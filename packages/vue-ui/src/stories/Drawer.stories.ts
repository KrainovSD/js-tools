import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref, useTemplateRef } from "vue";
import { VButton, VDrawer, VInput, VSelect, VText, VTextArea, VTooltip } from "../ui";

const meta = {
  title: "Components/Drawer",
  component: VDrawer,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VDrawer> = (args) => ({
  components: { VDrawer },
  setup() {
    const open = ref(false);

    function toggleDrawer() {
      open.value = !open.value;
    }

    return { args, toggleDrawer, open };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VButton,
        {
          onClick: this.toggleDrawer,
        },
        { default: () => "Открыть" },
      ),
      h(VDrawer, {
        ...args,
        modelValue: this.open,
        "onUpdate:modelValue": (value) => (this.open = value),
      }),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  header: "Заголовок",
};

export const AllInOne: Story = {
  render: () => ({
    components: { VButton, VDrawer, VText },
    setup() {
      const content = h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "20px" } },
        {
          default: () => [
            h(VInput, { autofocus: false }),
            h(VTextArea, { autofocus: true }),
            h(VSelect, { autofocus: true, options: [] }),
            h(VText, {}, { default: () => "Содержимое модального окна" }),
            h(VText, {}, { default: () => "Содержимое модального окна" }),
            h(VButton, {}, { default: () => "Содержимое модального окна" }),
            h(VButton, {}, { default: () => "Содержимое модального окна" }),
          ],
        },
      );
      const modalRoot = useTemplateRef("modal-root");
      const modalRoot2 = useTemplateRef("modal-root-2");

      return {
        content,
        modalRoot,
        modalRoot2,
      };
    },
    render() {
      return h(
        "div",
        {
          id: "modal-root",
          ref: "modal-root",
          style: {
            display: "flex",
            justifyContent: "space-between",
            height: "calc(100vh - 50px)",
            overflow: "hidden",
          },
        },
        [
          h(
            "div",
            {
              ref: "modal-root-2",
              style: { display: "flex", flexDirection: "column", gap: "20px", flex: 1 },
            },
            [
              h(
                VDrawer,
                {
                  autofocus: false,
                  header: "Right Modal",
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Right Modal"),
                },
              ),
              h(
                VDrawer,
                {
                  header: "Bottom Modal",
                  placement: "bottom",
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Bottom Modal"),
                },
              ),

              h(
                VDrawer,
                {
                  header: "Left Modal",
                  placement: "left",
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Left Modal"),
                },
              ),

              h(
                VDrawer,
                {
                  header: "Top Modal",
                  placement: "top",
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Top Modal"),
                },
              ),

              h(
                VDrawer,
                {
                  header: "Without Mask",
                  mask: false,
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Without Mask"),
                },
              ),

              h(
                VDrawer,
                {
                  header: "Tooltip",
                  mask: false,
                },
                {
                  content: () => this.content,
                  default: () =>
                    h(VTooltip, { text: "Drawer" }, () => h(VButton, {}, () => "Tooltip")),
                },
              ),

              h(
                VDrawer,
                {},
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Custom Header"),

                  "custom-header": () => "Custom Header",
                },
              ),

              h(
                VDrawer,
                {
                  header: "Block right",
                  block: true,
                  target: this.modalRoot as HTMLElement | undefined,
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Block right"),
                },
              ),
              h(
                VDrawer,
                {
                  header: "Block bottom",
                  block: true,
                  target: this.modalRoot2 as HTMLElement | undefined,
                  placement: "bottom",
                },
                {
                  content: () => this.content,
                  default: () => h(VButton, {}, () => "Block bottom"),
                },
              ),
              h("div", { style: { display: "flex", flex: 1 } }),
            ],
          ),
          h("span", {}, "right content"),
        ],
      );
    },
  }),
  args: {},
};
