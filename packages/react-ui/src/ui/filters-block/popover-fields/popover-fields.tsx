import { arrayToMapByKey } from "@krainovsd/js-helpers";
import { FilterOutlined } from "@krainovsd/react-icons";
import { type FormInstance } from "antd";
import React from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Popover } from "../../popover";
import { CommonField } from "../common-field";
import { PopoverField } from "../popover-field";
import type { FilterFieldType, FilterInputValueType } from "../types";
import styles from "./popover-fields.module.scss";

const typedMemo: <T>(c: T) => T = React.memo;

type Props<T extends Record<string, FilterInputValueType>> = {
  fields: FilterFieldType[];
  initialValues?: Partial<T>;
  filter?: Partial<T>;
  onValuesChange?: (values: T, field: keyof T, value: T[keyof T] | undefined) => void;
  form: FormInstance<T>;
  isDisabledFields?: boolean;
  filterLabel: string;
};
export const PopoverFields = typedMemo(function PopoverFields<
  T extends Record<string, FilterInputValueType>,
>(props: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const [newFilter, setNewFilter] = React.useState("");
  const [selectedFields, setSelectedFields] = React.useState<string[]>([]);

  const fieldsMap = React.useMemo(() => {
    return arrayToMapByKey(props.fields, "name");
  }, [props.fields]);

  const selectedFieldsInfo = React.useMemo(() => {
    return selectedFields.map((name) => fieldsMap[name]);
  }, [fieldsMap, selectedFields]);

  const noSelectedFieldsInfo = React.useMemo(() => {
    return props.fields.filter((field) => !selectedFields.includes(field.name));
  }, [props.fields, selectedFields]);

  const handleSelectChange = React.useCallback((field: FilterFieldType) => {
    setOpen(false);
    setNewFilter(field.name);
    setSelectedFields((prev) => [...prev, field.name]);
  }, []);

  const handleRemoveField = React.useCallback(
    (field: FilterFieldType) => {
      setOpen(false);
      setNewFilter("");
      setSelectedFields((prev) => prev.filter((prevField) => prevField !== field.name));
      props.form.setFieldValue(
        field.name as Parameters<FormInstance<T>["setFieldValue"]>[0],
        undefined,
      );

      if (props.onValuesChange) {
        const currentValues = props.form.getFieldsValue();
        props.onValuesChange(currentValues, field.name as keyof T, undefined);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.form, props.onValuesChange],
  );

  React.useEffect(() => {
    if (!!props.fields?.length && props.filter) {
      setSelectedFields((prev) => [
        ...new Set([
          ...prev,
          ...Object.keys(props.filter ?? {}).filter((key) => props.filter?.[key] != undefined),
        ]).values(),
      ]);
    }
  }, [props.fields, props.filter]);

  React.useEffect(() => {
    if (!!props.fields?.length && props.initialValues) {
      setSelectedFields(Object.keys(props.initialValues));
    }
  }, [props.fields, props.initialValues]);

  return (
    <>
      <Popover
        placement="bottomLeft"
        arrow={false}
        content={
          <Flex vertical align="start">
            {noSelectedFieldsInfo.map((field) => (
              <Button
                className={styles.popoverButton}
                key={field.name}
                type="text"
                icon={field.icon}
                onClick={() => handleSelectChange(field)}
              >
                {field.label}
              </Button>
            ))}
          </Flex>
        }
        trigger="click"
        open={props.fields.length !== selectedFields.length && open}
        onOpenChange={setOpen}
      >
        <Button
          className={styles.filterButton}
          disabled={props.isDisabledFields || props.fields.length === selectedFields.length}
          shape="default"
          type="default"
          size="middle"
        >
          <FilterOutlined size={16} />
          {props.filterLabel}
        </Button>
      </Popover>
      {selectedFieldsInfo.map((field) => {
        if (field.popover) {
          return (
            <PopoverField
              key={field.name}
              form={props.form}
              newFilter={newFilter === field.name}
              onRemove={() => handleRemoveField(field)}
              field={field}
            />
          );
        }

        return (
          <CommonField
            key={field.name}
            form={props.form}
            newFilter={newFilter === field.name}
            onRemove={() => handleRemoveField(field)}
            field={field}
          />
        );
      })}
    </>
  );
});
