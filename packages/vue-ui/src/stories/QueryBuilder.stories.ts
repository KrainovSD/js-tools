import type { Meta, StoryFn } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import { type FilterItem, type QueryBuilderProps, VQueryBuilder } from "../ui";

const QueryBuilder = VQueryBuilder as unknown as DefineComponent<
  QueryBuilderProps<string, string | number, string | number>
>;

const meta = {
  title: "Components/QueryBuilder",
  component: QueryBuilder,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof QueryBuilder>;

export default meta;

const FILTERS: FilterItem<string, string | number>[] = [
  {
    field: "string",
    label: "Имя файла",
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
    components: [{ component: "text" }],
  },
  {
    field: "number",
    label: "Сумма",
    components: [{ component: "number", props: { min: -5, max: 5 } }],
  },
  {
    field: "range",
    label: "Количество",
    components: [{ component: "number-range" }],
  },
  {
    field: "select",
    label: "Тип (Несколько)",
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
    field: "date",
    label: "Дата создания",
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
];

const Template: StoryFn<typeof QueryBuilder> = (args) => ({
  components: { VQueryBuilder },
  setup() {
    return { args };
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          border: "1px solid white",
          padding: "20px",
          width: "800px",
        },
      },
      [h(VQueryBuilder, { ...args }, () => "Выбрать значение")],
    );
  },
});

export const Primary = Template.bind({});
Primary.args = {
  fields: FILTERS,
  combinators: [
    { label: "И", value: "and", color: "purple" },
    { label: "ИЛИ", value: "or", color: "blue" },
  ],
};
