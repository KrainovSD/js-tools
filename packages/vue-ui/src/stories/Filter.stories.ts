import { dateFormat, getDateByRules } from "@krainovsd/js-helpers";
import {
  VCarOutlined,
  VClockCircleOutlined,
  VDollarOutlined,
  VEditOutlined,
  VFileOutlined,
  VSkinOutlined,
} from "@krainovsd/vue-icons";
import type { Meta, StoryFn } from "@storybook/vue3";
import { h, ref } from "vue";
import { type FilterItem, VFilter } from "../ui";

const meta = {
  title: "Components/Filter",
  component: VFilter,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VFilter>;

export default meta;

const FILTERS: FilterItem[] = [
  {
    field: "string",
    label: "Имя файла",
    icon: VFileOutlined,
    component: "text",
    props: { placeholder: "Имя файла", allowClear: true },
  },
  {
    field: "long",
    label: "Очень длинное название поля для компонента фильтра",
    icon: VFileOutlined,
    component: "text",
  },
  {
    field: "number",
    label: "Сумма",
    icon: VDollarOutlined,
    component: "number",
    props: { min: -5, max: 5 },
  },
  { field: "range", label: "Количество", icon: VSkinOutlined, component: "number-range" },
  {
    field: "select",
    label: "Тип (Несколько)",
    icon: VCarOutlined,
    component: "select",
    props: {
      options: [
        { label: "Тип 1", value: 1 },
        { label: "Тип 2", value: 2 },
        { label: "Тип 3", value: 3 },
        { label: "Тип 4", value: 4 },
      ],
      clear: true,
      multiple: true,
      placeholder: "Выберите тип",
      search: true,
    },
  },
  {
    field: "select_single",
    label: "Тип (Один)",
    icon: VCarOutlined,
    component: "select",
    props: {
      options: [
        { label: "Тип 1", value: 1 },
        { label: "Тип 2", value: 2 },
        { label: "Тип 3", value: 3 },
        { label: "Тип 4", value: 4 },
      ],
      clear: true,
      multiple: false,
      placeholder: "Выберите тип",
      search: true,
    },
    operators: [
      { label: "==", value: "equal" },
      { label: "!=", value: "not_equal" },
    ],
  },
  { field: "date", label: "Дата создания", icon: VClockCircleOutlined, component: "date" },
  { field: "date-range", label: "Дата изменения", icon: VEditOutlined, component: "date-range" },
];

const Template: StoryFn<typeof VFilter> = (args) => ({
  components: { VFilter },
  setup() {
    const filter = ref<Record<string, unknown>>({
      string: "Тестовое",
      long: "Очень длинное значение для компонента фильтра",
      range: [1, 5],
      number: 0,
      select: [1],
      // eslint-disable-next-line camelcase
      select_single: 1,
      date: dateFormat(getDateByRules([{ increment: -1, type: "years" }]), "YYYY-MM-DD"),
      "date-range": [
        dateFormat(getDateByRules([{ increment: -1, type: "years" }]), "YYYY-MM-DD"),
        dateFormat(getDateByRules([{ increment: 0, type: "years" }]), "YYYY-MM-DD"),
      ],
    });
    // eslint-disable-next-line camelcase
    const operators = ref<Record<string, unknown>>({ select_single: "equal" });

    return { args, filter, operators };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "100px" } }, [
      h(VFilter, {
        ...args,
        modelValue: this.filter,
        "onUpdate:modelValue": (value) => (this.filter = value),
        operators: this.operators,
        "onUpdate:operators": (value) => (this.operators = value),
      }),
      h("div", {}, [JSON.stringify(this.filter)]),
      h("div", {}, [JSON.stringify(this.operators)]),
    ]);
  },
});
const EmptyTemplate: StoryFn<typeof VFilter> = (args) => ({
  components: { VFilter },
  setup() {
    const filter = ref<Record<string, unknown>>({});
    // eslint-disable-next-line camelcase
    const operators = ref<Record<string, unknown>>({ select_single: "equal" });

    return { args, filter, operators };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "100px" } }, [
      h(VFilter, {
        ...args,
        modelValue: this.filter,
        "onUpdate:modelValue": (value) => (this.filter = value),
        operators: this.operators,
        "onUpdate:operators": (value) => (this.operators = value),
      }),
      h("div", {}, [JSON.stringify(this.filter)]),
      h("div", {}, [JSON.stringify(this.operators)]),
    ]);
  },
});

export const Primary = Template.bind({});
Primary.args = {
  filters: FILTERS,
};
export const Small = Template.bind({});
Small.args = {
  filters: FILTERS,
  buttonSize: "small",
  controlSize: "small",
};
export const Large = Template.bind({});
Large.args = {
  filters: FILTERS,
  buttonSize: "large",
  controlSize: "large",
  controlVariant: "filled",
};
export const Empty = EmptyTemplate.bind({});
Empty.args = {
  filters: FILTERS,
};
