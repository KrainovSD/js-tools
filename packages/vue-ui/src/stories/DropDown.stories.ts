import { VSettingFilled } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VDropDown, VText } from "../ui";

const meta = {
  title: "Components/DropDown",
  component: VDropDown,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VDropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VDropDown> = (args) => ({
  components: { VDropDown },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VDropDown,
        { ...args, triggers: ["click"] },
        {
          default: () => h(VButton, {}, () => "Dropdown Click"),
        },
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  menu: [
    { key: "1", label: "Пункт 1" },
    { key: "2", label: "Пункт 2" },
    { key: "3", label: "Пункт 3" },
    { key: "0", divider: true },
    {
      key: "4",
      label: h(VText, {}, () => "Компонент"),
      icon: h(VSettingFilled, { size: 16 }),
    },
  ],
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VDropDown },
    setup() {
      return { args };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "20px" } }, [
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VDropDown,
            { ...args, triggers: ["hover"], classNamePositionerContent: "test-class" },
            {
              default: () => h(VButton, {}, () => "Dropdown Hover"),
            },
          ),
          h(
            VDropDown,
            { ...args, triggers: ["click"] },
            {
              default: () => h(VButton, {}, () => "Dropdown Click"),
            },
          ),
          h(
            VDropDown,
            { ...args, triggers: ["contextMenu"] },
            {
              default: () => h(VButton, {}, () => "Dropdown Context"),
            },
          ),

          h(
            VDropDown,
            { ...args, arrow: true },
            {
              default: () => h(VButton, {}, () => "Dropdown Arrow"),
            },
          ),

          h(
            VDropDown,
            { ...args, arrow: true, interactiveMode: "focusable" },
            {
              default: () => h(VButton, {}, () => "Dropdown Focusable mode"),
            },
          ),

          h(
            VDropDown,
            { ...args },
            {
              default: () => h(VText, {}, () => "Dropdown by not interactive"),
            },
          ),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VDropDown,
            {
              size: "large",
              menu: [
                { key: "1", link: true, label: h("a", { href: "#test" }, ["Пункт 1"]) },
                { key: "2", label: "Пункт 2" },
                {
                  key: "3",
                  label: "Пункт 3",
                  innerOptions: {
                    innerArrow: true,
                    placement: "right-top",
                    menu: [
                      { key: "1", label: "Пункт 4" },
                      { key: "2", label: "Пункт 5 (И длинное описание этого пункта)" },
                      { key: "3", divider: true },
                      {
                        key: "4",
                        label: "Пункт 6",
                        innerOptions: {
                          innerArrow: true,
                          placement: "right-top",
                          menu: [
                            { key: "1", label: "Пункт 7" },
                            { key: "2", label: "Пункт 8" },
                            { key: "3", divider: true },
                            {
                              key: "4",
                              label: "Пункт 9",
                              innerOptions: {
                                innerArrow: true,
                                placement: "left-top",
                                menu: [
                                  {
                                    key: "1",
                                    link: true,
                                    label: h("a", { href: "#test" }, ["Пункт 10"]),
                                  },
                                  { key: "2", label: "Пункт 11" },
                                  { key: "3", divider: true },
                                  { key: "4", label: "Пункт 12" },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { key: "0", divider: true },
                {
                  key: "4",
                  // eslint-disable-next-line no-console
                  onClick: (event) => console.log(event),
                  label: h(VText, {}, () => "Компонент"),
                  icon: h(VSettingFilled, { size: 16 }),
                },
              ],
            },
            {
              default: () => h(VButton, {}, () => "Dropdown inner"),
            },
          ),
          h(
            VDropDown,
            {
              size: "large",
              menu: [
                { key: "1", link: true, label: h("a", { href: "#test" }, ["Пункт 1"]) },
                { key: "2", label: "Пункт 2" },
                {
                  key: "3",
                  label: "Пункт 3",
                  innerOptions: {
                    innerArrow: true,
                    placement: "right-top",
                    triggers: ["hover", "click"],
                    menu: [
                      { key: "1", label: "Пункт 4" },
                      { key: "2", label: "Пункт 5 (И длинное описание этого пункта)" },
                      { key: "3", divider: true },
                      {
                        key: "4",
                        label: "Пункт 6",
                        innerOptions: {
                          triggers: ["hover", "click"],
                          innerArrow: true,
                          placement: "right-top",
                          menu: [
                            { key: "1", label: "Пункт 7" },
                            { key: "2", label: "Пункт 8" },
                            { key: "3", divider: true },
                            {
                              key: "4",
                              label: "Пункт 9",
                              innerOptions: {
                                triggers: ["hover", "click"],
                                innerArrow: true,
                                placement: "left-top",
                                menu: [
                                  {
                                    key: "1",
                                    link: true,
                                    label: h("a", { href: "#test" }, ["Пункт 10"]),
                                  },
                                  { key: "2", label: "Пункт 11" },
                                  { key: "3", divider: true },
                                  { key: "4", label: "Пункт 12" },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { key: "0", divider: true },
                {
                  key: "4",
                  // eslint-disable-next-line no-console
                  onClick: (event) => console.log(event),
                  label: h(VText, {}, () => "Компонент"),
                  icon: h(VSettingFilled, { size: 16 }),
                },
              ],
            },
            {
              default: () => h(VButton, {}, () => "Dropdown inner hover"),
            },
          ),
        ]),
      ]);
    },
  }),
  args: {
    menu: [
      { key: "1", link: true, label: h("a", { href: "#test" }, ["Пункт 1"]) },
      { key: "2", label: "Пункт 2" },
      { key: "3", label: "Пункт 3" },
      { key: "0", divider: true },
      {
        key: "4",
        // eslint-disable-next-line no-console
        onClick: (event) => console.log(event),
        label: h(VText, {}, () => "Компонент"),
        icon: h(VSettingFilled, { size: 16 }),
      },
    ],
  },
};
