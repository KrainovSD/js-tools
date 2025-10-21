import { VSettingOutlined } from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, ref } from "vue";
import { VButton, VInput, VModal, VSelect, VText } from "../ui";

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
          h(VText, {}, { default: () => "Содержимое модального окна" }),
          h(VText, {}, { default: () => "Содержимое модального окна" }),
          h(VButton, {}, { default: () => "Содержимое модального окна" }),
          h(VButton, {}, { default: () => "Содержимое модального окна" }),
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
          h(VText, {}, { default: () => "Содержимое модального окна" }),
          h(VText, {}, { default: () => "Содержимое модального окна" }),
          h(VButton, {}, { default: () => "Содержимое модального окна" }),
          h(VButton, {}, { default: () => "Содержимое модального окна" }),
        ],
      },
    );

    return { args, flag, content, content2 };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(
        VModal,
        {
          ...args,
          style: {
            minWidth: "50%",
          },
        },
        {
          content: () => (this.flag ? this.content2 : this.content),
          default: () => h(VButton, {}, () => "Default"),
        },
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  header: "Title",
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VModal },
    setup() {
      const open4 = ref(false);

      return { args, open4 };
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
            VModal,
            {
              ...args,
              style: {
                minWidth: "80%",
              },
            },
            {
              content: () => "Контент",
              default: () => h(VButton, {}, () => "Default"),
            },
          ),

          h(
            VModal,
            {
              ...args,
              style: {
                minWidth: "50%",
              },
            },
            {
              default: () => h(VButton, {}, () => "Custom"),
              content: () => "Контент",
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
            VModal,
            {
              ...args,
              header:
                "Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title Big Title",
              style: {
                minWidth: "50%",
                maxWidth: "50%",
              },
            },
            {
              content: () =>
                "Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big ContentBig Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content Big Content ",
              default: () => h(VButton, {}, () => "Big"),
            },
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
            { content: () => "Контент" },
          ),
        ],
      );
    },
  }),
  args: {
    header: "Заголовок",
  },
};
