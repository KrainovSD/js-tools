import { VSettingOutlined } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VButton, VModal, VText } from "../ui";

const meta = {
  title: "Components/Modal",
  component: VModal,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VModal> = (args) => ({
  components: { VModal },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VModal, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VModal },
    setup() {
      const open1 = ref(false);
      const open2 = ref(false);
      const open3 = ref(false);
      const open4 = ref(false);

      return { args, open1, open2, open3, open4 };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            transform: "translate(0, 0)",
            width: "calc(100vw - 50px)",
            height: "calc(100vh - 50px)",
          },
        },
        [
          h(
            VButton,
            {
              onClick: () => {
                this.open1 = true;
              },
            },
            () => "Default",
          ),
          h(
            VModal,
            {
              ...args,
              style: {
                minWidth: "50%",
              },
              modelValue: this.open1,
              "onUpdate:modelValue": (value) => {
                this.open1 = value;
              },
            },
            () => "Контент",
          ),
          h(
            VButton,
            {
              onClick: () => {
                this.open2 = true;
              },
            },
            () => "Custom",
          ),
          h(
            VModal,
            {
              ...args,
              style: {
                minWidth: "50%",
              },
              modelValue: this.open2,
              "onUpdate:modelValue": (value) => {
                this.open2 = value;
              },
            },
            {
              default: () => "Контент",
              header: () =>
                h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, [
                  h(VSettingOutlined, { size: 14 }),
                  h(VText, {}, () => "Кастомный хедер"),
                ]),
              footer: () =>
                h(
                  VButton,
                  {
                    onClick: () => {
                      this.open2 = false;
                    },
                    type: "dashed",
                  },
                  () => "Кастомный футер",
                ),
            },
          ),
          h(
            VButton,
            {
              onClick: () => {
                this.open3 = true;
              },
            },
            () => "Big",
          ),
          h(
            VModal,
            {
              ...args,
              header:
                "Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title",
              style: {
                minWidth: "50%",
              },
              modelValue: this.open3,
              "onUpdate:modelValue": (value) => {
                this.open3 = value;
              },
            },
            () =>
              "Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content ",
          ),
          h(
            VButton,
            {
              onClick: () => {
                this.open4 = true;
              },
              style: {
                position: "absolute",
                inset: "auto 0 0 auto",
              },
            },
            () => "Default",
          ),
          h(
            VModal,
            {
              ...args,
              style: {
                minWidth: "50%",
              },
              modelValue: this.open4,
              "onUpdate:modelValue": (value) => {
                this.open4 = value;
              },
            },
            () => "Контент",
          ),
        ],
      );
    },
  }),
  args: {
    header: "Заголовок",
  },
};
