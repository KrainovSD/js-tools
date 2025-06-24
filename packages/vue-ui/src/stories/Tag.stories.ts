import {
  VCheckCircleOutlined,
  VClockCircleOutlined,
  VCloseCircleOutlined,
  VInfoCircleOutlined,
  VMinusCircleOutlined,
  VSelectOutlined,
} from "@krainovsd/vue-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, reactive } from "vue";
import SyncOutlinedAnimated from "../tech/SyncOutlinedAnimated.vue";
import { VTag, VTagCheckable } from "../ui";

const meta = {
  title: "Components/Tag",
  component: VTag,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VTag>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VTag> = (args) => ({
  components: { VTag },
  setup() {
    return { args };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
      h(VTag, { ...args }, () => "Выбрать значение"),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VTag },
    setup() {
      const results = reactive([]);

      return { args, results };
    },
    render() {
      return h("div", { style: { display: "flex", gap: "20px" } }, [
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(VTag, { ...args }, () => "Default"),
          h(VTag, { ...args }, { default: () => "With Icon", icon: () => h(VSelectOutlined) }),
          h(VTag, { ...args, closable: true }, () => "Closable"),
          h(VTag, { ...args, borderless: true }, () => "Borderless"),

          h(
            VTagCheckable,
            {
              ...args,
              modelValue: this.results,
              "onUpdate:modelValue": (value) => (this.results = value),
              value: "test",
            },
            () => "Checkable",
          ),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(VTag, { ...args, color: "processing" }, () => "processing"),
          h(VTag, { ...args, color: "success" }, () => "success"),
          h(VTag, { ...args, color: "error" }, () => "error"),
          h(VTag, { ...args, color: "warning" }, () => "warning"),
          h(VTag, { ...args, color: "magenta" }, () => "magenta"),
          h(VTag, { ...args, color: "red" }, () => "red"),
          h(VTag, { ...args, color: "volcano" }, () => "volcano"),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(VTag, { ...args, color: "orange" }, () => "orange"),
          h(VTag, { ...args, color: "gold" }, () => "gold"),
          h(VTag, { ...args, color: "lime" }, () => "lime"),
          h(VTag, { ...args, color: "green" }, () => "green"),
          h(VTag, { ...args, color: "cyan" }, () => "cyan"),
          h(VTag, { ...args, color: "blue" }, () => "blue"),
          h(VTag, { ...args, color: "geekblue" }, () => "geekblue"),
          h(VTag, { ...args, color: "purple" }, () => "purple"),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VTag,
            { ...args, color: "processing" },
            { default: () => "processing", icon: () => h(SyncOutlinedAnimated) },
          ),
          h(
            VTag,
            { ...args, color: "success" },
            { default: () => "success", icon: () => h(VCheckCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, color: "error" },
            { default: () => "error", icon: () => h(VCloseCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, color: "warning" },
            { default: () => "warning", icon: () => h(VInfoCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, color: "default" },
            { default: () => "waiting", icon: () => h(VClockCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, color: "default" },
            { default: () => "stop", icon: () => h(VMinusCircleOutlined) },
          ),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VTag,
            { ...args, size: "large", color: "processing" },
            { default: () => "processing", icon: () => h(SyncOutlinedAnimated) },
          ),
          h(
            VTag,
            { ...args, size: "large", color: "success" },
            { default: () => "success", icon: () => h(VCheckCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "large", color: "error" },
            { default: () => "error", icon: () => h(VCloseCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "large", color: "warning" },
            { default: () => "warning", icon: () => h(VInfoCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "large", color: "default" },
            { default: () => "waiting", icon: () => h(VClockCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "large", color: "default" },
            { default: () => "stop", icon: () => h(VMinusCircleOutlined) },
          ),
          h(VTag, { ...args, closable: true, size: "large" }, () => "Closable"),
          h(VTag, { ...args, borderless: true, size: "large" }, () => "Borderless"),

          h(
            VTagCheckable,
            {
              ...args,
              modelValue: this.results,
              "onUpdate:modelValue": (value) => (this.results = value),
              value: "test",
              size: "large",
            },
            () => "Checkable",
          ),
        ]),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "20px" } }, [
          h(
            VTag,
            { ...args, size: "extra-large", color: "processing" },
            { default: () => "processing", icon: () => h(SyncOutlinedAnimated) },
          ),
          h(
            VTag,
            { ...args, size: "extra-large", color: "success" },
            { default: () => "success", icon: () => h(VCheckCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "extra-large", color: "error" },
            { default: () => "error", icon: () => h(VCloseCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "extra-large", color: "warning" },
            { default: () => "warning", icon: () => h(VInfoCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "extra-large", color: "default" },
            { default: () => "waiting", icon: () => h(VClockCircleOutlined) },
          ),
          h(
            VTag,
            { ...args, size: "extra-large", color: "default" },
            { default: () => "stop", icon: () => h(VMinusCircleOutlined) },
          ),
          h(VTag, { ...args, closable: true, size: "extra-large" }, () => "Closable"),
          h(VTag, { ...args, borderless: true, size: "extra-large" }, () => "Borderless"),

          h(
            VTagCheckable,
            {
              ...args,
              modelValue: this.results,
              "onUpdate:modelValue": (value) => (this.results = value),
              value: "test",
              size: "extra-large",
            },
            () => "Checkable",
          ),
        ]),
      ]);
    },
  }),
  args: {},
};
