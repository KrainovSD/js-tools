import type { Meta, StoryFn } from "@storybook/vue3";
import { type DefineComponent, h } from "vue";
import {
  type QueryBuilderProps,
  type QueryCondition,
  type QueryField,
  VQueryBuilder,
  transformQueryFromShort,
  transformQueryToShort,
} from "../ui";

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

const FILTERS: QueryField<string, string | number>[] = [
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
    components: [{ component: "text", operatorLabel: "равно", operatorValue: "equal" }],
  },
  {
    field: "number",
    label: "Сумма",
    components: [
      {
        component: "number",
        props: { min: -5, max: 5 },
        operatorLabel: "равно",
        operatorValue: "equal",
      },
    ],
  },
  {
    field: "range",
    label: "Количество",
    components: [{ component: "number-range", operatorLabel: "равно", operatorValue: "equal" }],
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
        operatorLabel: "равно",
        operatorValue: "equal",
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
const QUERY: QueryCondition<string, string, string>[] = [
  {
    type: "group",
    combinator: "and",
    id: 2750221822502621,
    rules: [
      {
        type: "rule",
        field: "string",
        id: 2061061316591201,
        operator: "equal",
        value: undefined,
      },
      {
        type: "rule",
        field: "string",
        operator: "equal",
        id: 258483429159071,
        value: undefined,
      },
      {
        type: "group",
        combinator: "and",
        id: 7052175195304605,
        rules: [
          {
            type: "rule",
            field: "string",
            operator: "equal",
            id: -7432856563198263,
            value: undefined,
          },
          {
            type: "rule",
            field: "string",
            operator: "equal",
            id: 482497605006951,
            value: undefined,
          },
          {
            type: "group",
            combinator: "and",
            id: -7973793753418131,
            rules: [
              {
                type: "rule",
                field: "string",
                operator: "equal",
                id: -5382463028788179,
                value: undefined,
              },
              {
                type: "rule",
                field: "string",
                operator: "equal",
                id: -1186939514375243,
                value: undefined,
              },
            ],
          },
          {
            type: "rule",
            field: "string",
            operator: "equal",
            id: -1450515866772377,
            value: undefined,
          },
        ],
      },
    ],
  },
];
const test = transformQueryToShort(QUERY);
console.log(test);
console.log(transformQueryFromShort(test));

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
      [h(VQueryBuilder, { ...args, modelValue: QUERY }, () => "Выбрать значение")],
    );
  },
});

export const Primary = Template.bind({ modelValue: QUERY });
Primary.args = {
  fields: FILTERS,
  combinators: [
    { label: "И", value: "and", color: "purple" },
    { label: "ИЛИ", value: "or", color: "blue" },
  ],
};
