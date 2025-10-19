import { dateFormat, getDateByRules, randomString } from "@krainovsd/js-helpers";
import {
  VCarOutlined,
  VClockCircleOutlined,
  VDollarOutlined,
  VEditOutlined,
  VFileOutlined,
  VSkinOutlined,
} from "@krainovsd/vue-icons";
import type { Meta, StoryFn } from "@storybook/vue3";
import { type DefineComponent, h, ref } from "vue";
import { type FilterItem, type FilterProps, type UserPickerUser, VFilter } from "../ui";

const Filter = VFilter as unknown as DefineComponent<FilterProps<string, string>>;

const meta = {
  title: "Components/Filter",
  component: Filter,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Filter>;

export default meta;

const USERS = Array.from<unknown, UserPickerUser>({ length: 30 }, (_, i) => ({
  id: i,
  name: randomString(10),
  username: `user_${i}`,
}));

const FILTERS: FilterItem<string, string | number>[] = [
  {
    field: "string",
    label: "Имя файла",
    icon: VFileOutlined,
    components: [
      {
        component: "text",
        props: { placeholder: "Имя файла", allowClear: true },
        operatorValue: "equal",
        operatorLabel: "Равен",
        operatorShortLabel: "==",
        clearTag: "text",
      },
      {
        component: "text",
        props: { placeholder: "Имя файла", allowClear: true },
        operatorValue: "!equal",
        operatorLabel: "Не равен",
        operatorShortLabel: "!=",
        clearTag: "text",
      },
    ],
  },
  {
    field: "long",
    label: "Очень длинное название поля для компонента фильтра",
    icon: VFileOutlined,
    components: [{ component: "text" }],
  },
  {
    field: "number",
    label: "Сумма",
    icon: VDollarOutlined,
    components: [{ component: "number", props: { min: -5, max: 5 } }],
  },
  {
    field: "range",
    label: "Количество",
    icon: VSkinOutlined,
    components: [{ component: "number-range" }],
  },
  {
    field: "select",
    label: "Тип (Несколько)",
    icon: VCarOutlined,
    components: [
      {
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
        clearTag: "select",
        operatorValue: "array_some",
        operatorLabel: "Вхождение хотя бы одного из элементов массива",
        operatorShortLabel: "∩",
      },
      {
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
        clearTag: "select",
        operatorValue: "!array_some",
        operatorLabel: "Отсутствие вхождения хотя бы одним из элементов массива",
        operatorShortLabel: "!∩",
      },
      {
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
        clearTag: "select",
        operatorValue: "array_every",
        operatorLabel: "Вхождение всех элементов массива",
        operatorShortLabel: "⊂",
      },
      {
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
        clearTag: "select",
        operatorValue: "!array_every",
        operatorLabel: "Отсутствие полного вхождения элементов массива",
        operatorShortLabel: "!⊂",
      },
    ],
  },
  {
    field: "select_single",
    label: "Тип (Один)",
    icon: VCarOutlined,
    components: [
      {
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
      },
    ],
  },
  {
    field: "custom_bool",
    label: "Кастомный буль",
    icon: VCarOutlined,
    components: [
      {
        component: "select",
        props: {
          options: [
            { label: "Нет", value: 0 },
            { label: "Да", value: 1 },
          ],
          clear: true,
          multiple: false,
          placeholder: "Выберите тип",
          search: true,
        },
      },
    ],
  },
  {
    field: "date",
    label: "Дата создания",
    icon: VClockCircleOutlined,
    components: [
      { component: "date", operatorLabel: "Дата", operatorValue: "date" },
      { component: "date-range", operatorLabel: "Между датами", operatorValue: "date-range" },
      {
        component: "date-range",
        operatorLabel: "Не между датами",
        operatorValue: "not-date-range",
      },
    ],
  },
  {
    field: "date-range",
    label: "Дата изменения",
    icon: VEditOutlined,
    components: [
      {
        component: "date-range",
        operatorLabel: "Между датами",
        operatorValue: "date-range",
        clearTag: "date-range",
      },
      {
        component: "date-range",
        operatorLabel: "Не между датами",
        operatorValue: "not-date-range",
        clearTag: "date-range",
      },
      { component: "date", operatorLabel: "Дата", operatorValue: "date" },
    ],
  },
  {
    field: "users",
    label: "Редактор",
    components: [
      {
        component: "user",
        operatorValue: "equal",
        operatorLabel: "Равен",
        props: { users: USERS, multiple: true },
      },
    ],
  },
];

const Template: StoryFn<typeof VFilter> = (args) => ({
  components: { VFilter },
  setup() {
    const filter = ref<Record<string, unknown>>({
      string: "Тестовое",
      long: "Очень длинное значение для компонента фильтра",
      range: [1, 5],
      number: 0,
      // eslint-disable-next-line camelcase
      custom_bool: 0,
      select: [1],
      // eslint-disable-next-line camelcase
      select_single: 1,
      date: dateFormat(getDateByRules([{ increment: -1, type: "years" }]), "YYYY-MM-DD"),
      "date-range": [
        dateFormat(getDateByRules([{ increment: -1, type: "years" }]), "YYYY-MM-DD"),
        dateFormat(getDateByRules([{ increment: 0, type: "years" }]), "YYYY-MM-DD"),
      ],
      users: [USERS[0].id],
    });
    const operators = ref<Record<string, unknown>>({});

    return { args, filter, operators };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "100px" } }, [
      h(VFilter, {
        ...args,
        modelValue: this.filter,
        "onUpdate:modelValue": (value) => {
          this.filter = value;
          // eslint-disable-next-line no-console
          console.log("updated");
        },
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
    const operators = ref<Record<string, unknown>>({});

    return { args, filter, operators };
  },
  render() {
    return h("div", { style: { display: "flex", flexDirection: "column", gap: "100px" } }, [
      h(
        "div",
        {
          style: {
            display: "flex",
            gap: "var(--ksd-filter-gap)",
            alignItems: "center",
            flexWrap: "wrap",
          },
        },
        [
          h(VFilter, {
            ...args,
            modelValue: this.filter,
            "onUpdate:modelValue": (value) => {
              this.filter = value;
              // eslint-disable-next-line no-console
              console.log("updated");
            },
            operators: this.operators,
            "onUpdate:operators": (value) => (this.operators = value),
          }),
        ],
      ),

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
export const Left = EmptyTemplate.bind({});
Left.args = {
  filters: FILTERS,
  direction: "left",
};
export const NoWrap = EmptyTemplate.bind({});
NoWrap.args = {
  filters: FILTERS,
  wrap: false,
};
