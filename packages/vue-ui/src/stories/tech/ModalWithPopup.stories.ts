import { randomString } from "@krainovsd/js-helpers";
import { VSettingFilled } from "@krainovsd/vue-icons";
import type { Meta, StoryFn } from "@storybook/vue3";
import { h, ref } from "vue";
import Empty from "../../tech/Empty.vue";
import {
  type SearchOption,
  VButton,
  VDrawer,
  VDropDown,
  VModal,
  VPopConfirm,
  VSearch,
  VSelect,
  VText,
  VTooltip,
} from "../../ui";

const meta = {
  title: "Tech/ModalWithPopup",
  component: Empty,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Empty>;

export default meta;

const Template: StoryFn<typeof Empty> = () => ({
  setup() {
    const open = ref(false);
    const open2 = ref(false);

    return { open, open2 };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VButton,
        {
          onClick: () => {
            this.open = true;
          },
        },
        () => "Modal",
      ),
      h(
        VButton,
        {
          onClick: () => {
            this.open2 = true;
          },
        },
        () => "Drawer",
      ),
      h(
        VModal,
        {
          header: "title",
          style: {
            minWidth: "50%",
          },
          modelValue: this.open,
          "onUpdate:modelValue": (value) => {
            this.open = value;
          },
        },
        () => [
          h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
            h(
              VSelect,
              {
                options: Array.from({ length: 20 }, (_, i) => ({
                  label: `Значение ${i}`,
                  value: i,
                })),
              },
              () => "Выбрать значение",
            ),
            h(VPopConfirm, { title: "title", text: "text" }, () => h(VButton, {}, () => "Активен")),
            h(
              VDropDown,
              {
                triggers: ["click"],
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
              {
                default: () => h(VButton, {}, () => "Dropdown Click"),
              },
            ),
            h(VSearch, {
              placeholder: "Поиск",
              options: Array.from<unknown, SearchOption>({ length: 300 }, (_, i) => ({
                key: i,
                label: randomString(50),
              })),
            }),
            h(VTooltip, { text: "Tooltip" }, () =>
              h(VText, { ellipsis: true, fit: true, style: { maxWidth: "100px" } }, () => "Hover"),
            ),
          ]),
        ],
      ),
      h(
        VDrawer,
        {
          header: "title",
          style: {
            minWidth: "50%",
          },
          modelValue: this.open2,
          "onUpdate:modelValue": (value) => {
            this.open2 = value;
          },
        },
        () => [
          h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
            h(
              VSelect,
              {
                options: Array.from({ length: 20 }, (_, i) => ({
                  label: `Значение ${i}`,
                  value: i,
                })),
              },
              () => "Выбрать значение",
            ),
            h(VPopConfirm, { title: "title", text: "text" }, () => h(VButton, {}, () => "Активен")),
            h(
              VDropDown,
              {
                triggers: ["click"],
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
              {
                default: () => h(VButton, {}, () => "Dropdown Click"),
              },
            ),
            h(VSearch, {
              placeholder: "Поиск",
              options: Array.from<unknown, SearchOption>({ length: 300 }, (_, i) => ({
                key: i,
                label: randomString(50),
              })),
            }),
            h(VTooltip, { text: "Tooltip" }, () =>
              h(VText, { ellipsis: true, fit: true, style: { maxWidth: "100px" } }, () => "Hover"),
            ),
          ]),
        ],
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};
