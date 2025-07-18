import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { computed, h, ref, useTemplateRef } from "vue";
import { VButton, VDrawer, VText } from "../ui";

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
        onClose: this.toggleDrawer,
        modelValue: this.open,
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
      const openFirst = ref(false);
      function toggleFirst() {
        openFirst.value = !openFirst.value;
      }
      const openSecond = ref(false);
      function toggleSecond() {
        openSecond.value = !openSecond.value;
      }
      const openThird = ref(false);
      function toggleThird() {
        openThird.value = !openThird.value;
      }
      const openFourth = ref(false);
      function toggleFourth() {
        openFourth.value = !openFourth.value;
      }
      const openFifth = ref(false);
      function toggleFifth() {
        openFifth.value = !openFifth.value;
      }
      const openSixth = ref(false);
      function toggleSixth() {
        openSixth.value = !openSixth.value;
      }
      const openBlockFirst = ref(false);
      function toggleBlockFirst() {
        openBlockFirst.value = !openBlockFirst.value;
      }
      const openBlockSecond = ref(false);
      function toggleBlockSecond() {
        openBlockSecond.value = !openBlockSecond.value;
      }

      const fifthButtonRef = useTemplateRef("button");
      const seventhButtonRef = useTemplateRef("button-seventh");

      const ignore = computed(() => [
        (fifthButtonRef.value as { buttonRef: HTMLElement })?.buttonRef,
        (seventhButtonRef.value as { buttonRef: HTMLElement })?.buttonRef,
      ]);

      const content = h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "20px" } },
        {
          default: () => [
            h(VText, {}, { default: () => "Содержимое модального окна" }),
            h(VText, {}, { default: () => "Содержимое модального окна" }),
            h(VButton, {}, { default: () => "Содержимое модального окна" }),
            h(VButton, {}, { default: () => "Содержимое модального окна" }),
          ],
        },
      );

      return {
        openFirst,
        toggleFirst,
        openSecond,
        toggleSecond,
        openThird,
        toggleThird,
        openFourth,
        toggleFourth,
        openFifth,
        toggleFifth,
        openSixth,
        toggleSixth,
        openBlockFirst,
        openBlockSecond,
        toggleBlockFirst,
        toggleBlockSecond,

        ignore,
        content,
      };
    },
    render() {
      return h(
        "div",
        {
          id: "modal-root",
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
              id: "modal-root-2",
              style: { display: "flex", flexDirection: "column", gap: "20px", flex: 1 },
            },
            [
              h(VButton, { onClick: this.toggleFirst }, () => "Right Modal"),
              h(
                VDrawer,
                {
                  modelValue: this.openFirst,
                  "onUpdate:modelValue": (value) => (this.openFirst = value),
                  header: "Right Modal",
                },
                {
                  default: () => this.content,
                },
              ),

              h(VButton, { onClick: this.toggleSecond }, () => "Bottom Modal"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openSecond = value),
                  modelValue: this.openSecond,
                  header: "Bottom Modal",
                  placement: "bottom",
                },
                {
                  default: () => this.content,
                },
              ),

              h(VButton, { onClick: this.toggleThird }, () => "Left Modal"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openThird = value),
                  modelValue: this.openThird,
                  header: "Left Modal",
                  placement: "left",
                },
                {
                  default: () => this.content,
                },
              ),

              h(VButton, { onClick: this.toggleFourth }, () => "Top Modal"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openFourth = value),
                  modelValue: this.openFourth,
                  header: "Top Modal",
                  placement: "top",
                },
                {
                  default: () => this.content,
                },
              ),

              h(VButton, { onClick: this.toggleFifth, ref: "button" }, () => "Without Mask"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openFifth = value),
                  modelValue: this.openFifth,
                  header: "Without Mask",
                  mask: false,
                  ignoreCloseByClick: this.ignore,
                },
                {
                  default: () => this.content,
                },
              ),

              h(VButton, { onClick: this.toggleSixth }, () => "Custom Header"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openSixth = value),
                  modelValue: this.openSixth,
                },
                {
                  default: () => this.content,
                  "custom-header": () => "Custom Header",
                },
              ),
              h(
                VButton,
                { onClick: this.toggleBlockFirst, ref: "button-seventh" },
                () => "Block right",
              ),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openBlockFirst = value),
                  modelValue: this.openBlockFirst,
                  header: "Block right",
                  block: true,
                  ignoreCloseByClick: this.ignore,
                  target: document.querySelector("#modal-root") as HTMLElement | undefined,
                },
                {
                  default: () => this.content,
                },
              ),
              h(VButton, { onClick: this.toggleBlockSecond }, () => "Block bottom"),
              h(
                VDrawer,
                {
                  "onUpdate:modelValue": (value) => (this.openBlockSecond = value),
                  modelValue: this.openBlockSecond,
                  header: "Block bottom",
                  block: true,
                  ignoreCloseByClick: this.ignore,
                  target: document.querySelector("#modal-root-2") as HTMLElement | undefined,
                  placement: "bottom",
                },
                {
                  default: () => this.content,
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
