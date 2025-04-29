import { Form } from "antd";
import React, { type CSSProperties } from "react";
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
  onValuesChange: (values: Partial<T>, field: keyof T, value: T[keyof T] | undefined) => void;
  initialValues?: Partial<T>;
  filter?: Partial<T>;
  onChangeSearch?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function FiltersBlock<T extends Record<string, FilterInputValueType>>(
  props: FiltersBlockProps<T>,
): React.JSX.Element {
  const [form] = Form.useForm<T>();

  React.useEffect(() => {
    if (props.initialValues) {
      form.setFieldsValue(props.initialValues as RecursivePartial<T>);
      Object.entries(props.initialValues).forEach(([key, value]: [string, T[keyof T]]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        props.onValuesChange(props.initialValues!, key, value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValues, form]);

  React.useEffect(() => {
    if (props.filter) {
      form.setFieldsValue(props.filter as RecursivePartial<T>);
    }
  }, [props.filter, form]);

  const onChangeFormValues = React.useCallback(
    (changedValue: Record<string, unknown>, values: T) => {
      const [key, value] = Object.entries(changedValue)[0];
      props.onValuesChange(values, key, value as T[keyof T]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onValuesChange],
  );

  return (
    <Form
      form={form}
      name="filters_form"
      onValuesChange={onChangeFormValues}
      initialValues={props.initialValues}
      style={{ width: "100%", ...props.style }}
      className={props.className}
    >
      <Flex justify="space-between" gap={12} align="flex-start">
        <Flex gap={8} wrap>
          {!!props.fixedFields?.length && <FixedFields fields={props.fixedFields} />}
          {props.fields && props.fields?.length > 0 && (
            <PopoverFields<T>
              fields={props.fields}
              filterLabel={props.filterLabel}
              form={form}
              onValuesChange={props.onValuesChange}
              initialValues={props.initialValues}
              isDisabledFields={props.isDisabledFields}
              filter={props.filter}
            />
          )}
        </Flex>

        {props.showSearchField && (
          <SearchField
            searchPlaceholder={props.searchPlaceholder}
            onChangeSearch={props.onChangeSearch}
          />
        )}
      </Flex>
    </Form>
  );
}
