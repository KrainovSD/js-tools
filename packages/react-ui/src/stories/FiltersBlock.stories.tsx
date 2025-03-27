/* eslint-disable no-console */
import { PlayPause } from "@krainovsd/react-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { type FilterFieldType, FiltersBlock, Flex, Input, Select } from "../ui";

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
        label: "Статус",
        name: "status2",
        icon: <PlayPause color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[] | string[]) => value,
        inputField: (
          <Select
            variant="outlined"
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
        label: "Тип",
        name: "type",
        icon: <PlayPause color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[]) =>
          value.map((item: Record<string, string>) => item.label).join(", "),
        inputField: (
          <Select
            mode={"multiple"}
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
        label: "Еще одно",
        name: "other",
        icon: <PlayPause color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[]) =>
          value.map((item: Record<string, string>) => item.label).join(", "),
        inputField: (
          <Select
            mode={"multiple"}
            variant="outlined"
            size="middle"
            style={{ width: "fit-content", minWidth: 200 }}
            options={[
              { value: "Супер длинное название", label: "Супер длинное название" },
              { value: "Супер длинное название 2", label: "Супер длинное название 2" },
              { value: "Стоп", label: "Стоп" },
            ]}
            placeholder={"Выберите статус"}
          />
        ),
      },
      {
        label: "И Еще одно",
        name: "and_other",
        icon: <PlayPause color={"black"} />,
        labelInValue: true,
        renderDisplayValue: (value: Record<string, string>[]) =>
          value.map((item: Record<string, string>) => item.label).join(", "),
        inputField: (
          <Select
            mode={"multiple"}
            variant="outlined"
            size="middle"
            style={{ width: "fit-content", minWidth: 200 }}
            options={[
              { value: "Супер длинное название", label: "Супер длинное название" },
              { value: "Супер длинное название 2", label: "Супер длинное название 2" },
              { value: "Стоп", label: "Стоп" },
            ]}
            placeholder={"Выберите статус"}
          />
        ),
      },
      {
        label: "Текстовое",
        name: "text",
        icon: <PlayPause color={"black"} />,
        renderDisplayValue: (value: Record<string, string>[]) => value,
        inputField: <Input placeholder={"Введите значение"} variant="outlined" size="middle" />,
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
