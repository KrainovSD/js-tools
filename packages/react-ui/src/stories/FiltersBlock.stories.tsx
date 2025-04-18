/* eslint-disable no-console */
import { dateFormat } from "@krainovsd/js-helpers";
import { PlayPauseLegacy } from "@krainovsd/react-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import {
  Button,
  DatePicker,
  DateRangePicker,
  type FilterFieldType,
  type FilterInputValueType,
  FiltersBlock,
  Flex,
  Input,
  InputNumber,
  Select,
  Text,
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
  const [filter, setFilter] = React.useState<Record<string, FilterInputValueType>>({});

  return (
    <Flex
      style={{ width: "90vw", height: "90vh", overflow: "hidden", background: "#e8e7e7" }}
      vertical
      gap={20}
    >
      <Button onClick={() => setFilter((prev) => ({ ...prev, string: "test" }))}>
        Добавить фильтр текста
      </Button>
      <FiltersBlock
        {...args}
        filter={filter}
        onValuesChange={(values, field, value) => {
          console.log(values, field, value);
          setFilter(values);
        }}
      />
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
        popover: true,
        renderDisplayValue: (value: Record<string, string>[] | string[]) => value,
        inputField: (
          <Select
            variant="outlined"
            showSearch
            size="middle"
            style={{ width: "fit-content", minWidth: 200, maxWidth: 300 }}
            options={[
              { value: 1, label: "Тест" },
              { value: 2, label: "Старт" },
              { value: 3, label: "Стоп" },
              {
                value: "Супер длинное название которо точно не поместится",
                label: "Супер длинное название которо точно не поместится",
              },
            ]}
            placeholder={"Select:"}
            labelRender={(props) => {
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              return <Text>{`Select: ${props.label?.toString?.()}`}</Text>;
            }}
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
        popover: true,
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: string) => dateFormat(value, "DD/MM/YYYY"),
        inputField: <DatePicker format={"DD/MM/YYYY"} />,
      },
      {
        label: "DateRangePicker",
        name: "dateRangePicker",
        popover: true,
        icon: <PlayPauseLegacy color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: string[]) =>
          value.map((val) => dateFormat(val, "DD/MM/YYYY")).join(" - "),
        inputField: <DateRangePicker format={"DD/MM/YYYY"} />,
      },
      {
        label: "String",
        name: "string",
        popover: true,
        icon: <PlayPauseLegacy color={"black"} />,
        renderDisplayValue: (value: Record<string, string>[]) => value,
        inputField: (
          <Input
            placeholder={"Введите значение"}
            variant="outlined"
            size="middle"
            style={{ width: "fit-content", minWidth: 200, maxWidth: 600 }}
          />
        ),
      },
      {
        label: "Number",
        name: "number",
        popover: true,
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
      // select: ["Старт"],
    },
    showSearchField: true,

    onValuesChange: (values, field, value) => {
      console.log(values, field, value);
    },
    searchPlaceholder: "Поиск",
  },
};
