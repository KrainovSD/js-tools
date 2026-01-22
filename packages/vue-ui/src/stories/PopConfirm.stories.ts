import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import { VButton, VPopConfirm } from "../ui";

const meta = {
  title: "Components/PopConfirm",
  component: VPopConfirm,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VPopConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VPopConfirm> = (args) => ({
  components: { VPopConfirm },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      // eslint-disable-next-line no-console
      h(VPopConfirm, { ...args, onClick: () => console.log("clicked") }, () =>
        h(VButton, {}, () => "Нажать"),
      ),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  text: "Большое спасибо за внимание?",
  title: "Внимание",
  active: true,
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VPopConfirm },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "20px", padding: "100px" } },
        [
          // eslint-disable-next-line no-console
          h(VPopConfirm, { ...args, onClick: () => console.log("clicked") }, () =>
            h(VButton, {}, () => "Активен"),
          ),
          // eslint-disable-next-line no-console
          h(VPopConfirm, { ...args, active: false, onClick: () => console.log("clicked") }, () =>
            h(VButton, {}, () => "Неактивен"),
          ),
          h(
            VPopConfirm,
            {
              ...args,
              title:
                "Внимание, Внимание, Внимание, Внимание, Внимание, Внимание, Внимание, Внимание",
              text: "Большое спасибо за внимание? Большое спасибо за внимание? Большое спасибо за внимание? Большое спасибо за внимание? Большое спасибо за внимание? Большое спасибо за внимание? Большое спасибо за внимание?",
              // eslint-disable-next-line no-console
              onClick: () => console.log("clicked"),
            },
            () => h(VButton, {}, () => "Много буков"),
          ),
        ],
      );
    },
  }),
  args: {
    text: "Большое спасибо за внимание?",
    title: "Внимание",
  },
};
