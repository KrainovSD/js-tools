/* eslint-disable no-console */
import { PlayPauseLegacy } from "@krainovsd/react-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import {
  DatePicker,
  DateRangePicker,
  type FilterFieldType,
  FiltersBlock,
  Flex,
  Input,
  InputNumber,
  Select,
} from "../ui";

const meta = {
  title: "Antd/FiltersBlock",
  component: FiltersBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof FiltersBlock>;

export default meta;
type Story = StoryObj<typeof FiltersBlock>;

const Template: StoryFn<typeof FiltersBlock> = (args) => {
  return (
    <Flex style={{ width: "90vw", height: "90vh", overflow: "hidden" }}>
      <FiltersBlock {...args} />
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {
    filterLabel: "Фильтр",
    fields: [
      {
        label: "Select",
        name: "select",
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[] | string[]) => value,
        inputField: (
          <Select
            variant="outlined"
            showSearch
            size="middle"
            style={{ width: "fit-content", minWidth: 200 }}
            options={[
              { value: "Тест", label: "Тест" },
              { value: "Старт", label: "Старт" },
              { value: "Стоп", label: "Стоп" },
            ]}
            placeholder={"Выберите статус"}
          />
        ),
      },
      {
        label: "MultiSelect",
        name: "multiSelect",
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        popover: true,
        renderDisplayValue: (value: string[]) => value.join(", "),
        inputField: (
          <Select
            mode={"multiple"}
            showSearch
            variant="outlined"
            size="middle"
            style={{ width: "fit-content", minWidth: 200, maxWidth: 600 }}
            options={[
              { value: "Супер длинное название", label: "Супер длинное название" },
              { value: "Супер длинное название 1", label: "Супер длинное название 1" },
              { value: "Супер длинное название 2", label: "Супер длинное название 2" },
            ]}
            placeholder={"Выберите статус"}
          />
        ),
      },
      {
        label: "DatePicker",
        name: "datePicker",
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[]) =>
          value.map((item: Record<string, string>) => item.label).join(", "),
        inputField: <DatePicker format={"DD/MM/YYYY"} />,
      },
      {
        label: "DateRangePicker",
        name: "dateRangePicker",
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[]) =>
          value.map((item: Record<string, string>) => item.label).join(", "),
        inputField: <DateRangePicker format={"DD/MM/YYYY"} />,
      },
      {
        label: "String",
        name: "string",
        icon: <PlayPauseLegacy color={"black"} />,
        renderDisplayValue: (value: Record<string, string>[]) => value,
        inputField: <Input placeholder={"Введите значение"} variant="outlined" size="middle" />,
      },
      {
        label: "Number",
        name: "number",
        icon: <PlayPauseLegacy color={"black"} />,
        renderDisplayValue: (value: Record<string, string>[]) => value,
        inputField: (
          <InputNumber placeholder={"Введите значение"} variant="outlined" size="middle" />
        ),
      },
    ] as unknown as FilterFieldType[],
    // fixedFields: [
    //   {
    //     label: "Статус",
    //     name: "status",
    //     icon: <PlayPause color={"black"} />,
    //     labelInValue: true,
    //     renderDisplayValue: (value: Record<string, string>[]) =>
    //       value.map((item: Record<string, string>) => item.label).join(", "),
    //     inputField: (
    //       <Select
    //         mode={"multiple"}
    //         labelInValue={true}
    //         variant="outlined"
    //         size="middle"
    //         style={{ width: "fit-content", minWidth: 200 }}
    //         options={[
    //           { value: "Тест", label: "Тест" },
    //           { value: "Старт", label: "Старт" },
    //           { value: "Стоп", label: "Стоп" },
    //         ]}
    //         placeholder={"Выберите статус"}
    //       />
    //     ),
    //   },
    // ] as unknown as FilterFieldType[],
    initialValues: {
      status: ["Старт"],
    },
    showSearchField: true,

    onValuesChange: (values, field, value) => {
      console.log(values, field, value);
    },
    searchPlaceholder: "Поиск",
  },
};
