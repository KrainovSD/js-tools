import { Form } from "antd";
import React from "react";
import { Flex } from "../flex";
import { FixedFields } from "./fixed-fields";
import { PopoverFields } from "./popover-fields";
import { SearchField } from "./search-field/search-field";
import type { FilterFieldType, FilterInputValueType } from "./types";

type RecursivePartial<T> =
  NonNullable<T> extends object
    ? {
        [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
          ? RecursivePartial<U>[]
          : NonNullable<T[P]> extends object
            ? RecursivePartial<T[P]>
            : T[P];
      }
    : T;

interface FiltersBlockProps<T extends Record<string, FilterInputValueType>> {
  filterLabel: string;
  fields?: FilterFieldType[];
  fixedFields?: FilterFieldType[];
  showSearchField?: boolean;
  searchPlaceholder?: string;
  isDisabledFields?: boolean;
  onValuesChange: (values: T) => void;
  initialValues?: Partial<T>;
  onChangeSearch?: (value: string) => void;
  position: "vertical" | "horizontal";
}

export function FiltersBlock<T extends Record<string, FilterInputValueType>>(
  props: FiltersBlockProps<T>,
): React.JSX.Element {
  const {
    fields,
    fixedFields,
    showSearchField,
    searchPlaceholder,
    isDisabledFields,
    onValuesChange,
    initialValues,
    filterLabel,
    onChangeSearch,
  } = props;
  const [form] = Form.useForm<T>();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues as RecursivePartial<T>);
    }
  }, [initialValues, form]);

  const onChangeFormValues = React.useCallback(
    (_: unknown, values: T) => {
      onValuesChange(values);
    },
    [onValuesChange],
  );

  return (
    <Form
      form={form}
      name="filters_form"
      onValuesChange={onChangeFormValues}
      initialValues={initialValues}
      style={{ width: "100%" }}
    >
      <Flex justify="space-between" gap={12} align="flex-start">
        <Flex gap={12} wrap>
          {!!fixedFields?.length && <FixedFields fields={fixedFields} />}
          {fields && fields?.length > 0 && (
            <PopoverFields<T>
              fields={fields}
              filterLabel={filterLabel}
              form={form}
              onValuesChange={onValuesChange}
              initialValues={initialValues}
              isDisabledFields={isDisabledFields}
            />
          )}
        </Flex>

        {showSearchField && (
          <SearchField searchPlaceholder={searchPlaceholder} onChangeSearch={onChangeSearch} />
        )}
      </Flex>
    </Form>
  );
}
