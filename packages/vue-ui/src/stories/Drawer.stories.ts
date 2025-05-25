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
        open: this.open,
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

      const fifthButtonRef = useTemplateRef("button");
      const ignore = computed(() => [(fifthButtonRef.value as { element: HTMLElement })?.element]);

      const content = h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "20px" } },
        {
          default: () => [
            h(VText, {}, { default: () => "Содержимое модального окна" }),
            h(VText, {}, { default: () => "Содержимое модального окна" }),
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
        ignore,
        content,
      };
    },
    render() {
      return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
        h(VButton, { onClick: this.toggleFirst }, () => "Right Modal"),
        h(
          VDrawer,
          {
            onClose: this.toggleFirst,
            open: this.openFirst,
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
            onClose: this.toggleSecond,
            open: this.openSecond,
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
            onClose: this.toggleThird,
            open: this.openThird,
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
            onClose: this.toggleFourth,
            open: this.openFourth,
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
            onClose: this.toggleFifth,
            open: this.openFifth,
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
            onClose: this.toggleSixth,
            open: this.openSixth,
          },
          {
            default: () => this.content,
            "custom-header": () => "Custom Header",
          },
        ),
      ]);
    },
  }),
  args: {},
};
