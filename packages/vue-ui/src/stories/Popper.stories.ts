import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VButton, VDivider, VInput, VPopper, VSelect, VText } from "../ui";

const meta = {
  title: "Components/Popper",
  component: VPopper,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPopper>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VPopper> = (args) => ({
  components: { VPopper },
  setup() {
    const flag = ref(0);
    const content = h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "20px" } },
      {
        default: () => [
          h(
            VButton,
            {
              onClick: () => {
                flag.value = 1;
              },
            },
            () => "SWITCH",
          ),
          h(VSelect, { options: [], autofocus: true, placeholder: "TextArea" }),
        ],
      },
    );
    const content2 = h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "20px" } },
      {
        default: () => [
          h(
            VButton,
            {
              onClick: () => {
                flag.value = 0;
              },
            },
            () => "SWITCH",
          ),
          h(VInput, { autofocus: true, placeholder: "Input" }),
        ],
      },
    );

    return { args, flag, content, content2 };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VPopper,
        { ...args },
        {
          default: () => h(VText, { fit: true, ellipsis: true }, () => "Текст для поппера"),
          content: () => (this.flag ? this.content2 : this.content),
        },
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  disabled: false,
};

export const Scroll: Story = {
  render: (args) => ({
    components: { VPopper },
    setup() {
      const contentInteractive = [
        h(VText, {}, () => "Пункт 1"),
        h(VText, {}, () => "Пункт 2"),
        h(VText, {}, () => "Пункт 3"),
        h(VDivider, {}),
        h(VText, {}, () => "Пункт 4"),
      ];

      return { args, contentInteractive };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            border: "1px solid var(--ksd-border-color)",
            padding: "var(--ksd-padding",
            height: "100%",
            overflow: "auto",
          },
        },
        [
          h("div", { display: "flex", gap: "20px", flexDirection: "column" }, [
            h("div", { style: { display: "flex", height: "400px", minHeight: "400px" } }, [
              "Контент",
            ]),
            h(
              VPopper,
              { ...args, triggers: ["click"] },
              {
                default: () => h(VButton, {}, () => "Click"),
                content: () => this.contentInteractive,
              },
            ),
            h("div", { style: { display: "flex", height: "400px", minHeight: "400px" } }, [
              "Контент",
            ]),
          ]),
        ],
      );
    },
  }),
  args: {},
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VPopper },
    setup() {
      const contentInteractive = [
        h(VText, {}, () => "Пункт 1"),
        h(VText, {}, () => "Пункт 2"),
        h(VText, {}, () => "Пункт 3"),
        h(VDivider, {}),
        h(VText, {}, () => "Пункт 4"),
      ];

      return { args, contentInteractive };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "20px" } }, [
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VPopper,
            { ...args, triggers: ["hover"] },
            {
              default: () => h(VButton, {}, () => "Popper Hover"),
              content: () => this.contentInteractive,
            },
          ),
          h(
            VPopper,
            { ...args, triggers: ["contextMenu"] },
            {
              default: () => h(VButton, {}, () => "Popper Context Menu"),
              content: () => this.contentInteractive,
            },
          ),
          h(
            VPopper,
            { ...args },
            {
              default: () => h(VButton, {}, () => "Popper Click"),
              content: () => this.contentInteractive,
            },
          ),
          h(
            VPopper,
            { ...args, fit: false },
            {
              default: () => h(VButton, {}, () => "Popper no fit"),
              content: () => this.contentInteractive,
            },
          ),
          h(
            VPopper,
            { ...args, arrow: true, closeByScroll: true },
            {
              default: () => h(VButton, {}, () => "Popper arrow"),
              content: () => this.contentInteractive,
            },
          ),
        ]),
      ]);
    },
  }),
  args: {},
};
