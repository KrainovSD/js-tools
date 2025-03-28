import { arrayToMapByKey } from "@krainovsd/js-helpers";
import { Filter } from "@krainovsd/react-icons";
import { type FormInstance } from "antd";
import React from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Popover } from "../../popover";
import { PopoverField } from "../popover-field";
import type { FilterFieldType, FilterInputValueType } from "../types";
import styles from "./popover-fields.module.scss";

const typedMemo: <T>(c: T) => T = React.memo;

type Props<T extends Record<string, FilterInputValueType>> = {
  fields: FilterFieldType[];
  initialValues?: Partial<T>;
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
  const [selectedFields, setSelectedFields] = React.useState<FilterFieldType[]>([]);

  const selectedFieldsMap = React.useMemo(() => {
    return arrayToMapByKey(selectedFields, "name");
  }, [selectedFields]);

  const selectedFieldsInfo = React.useMemo(() => {
    return props.fields.filter((field) => selectedFieldsMap[field.name] != undefined);
  }, [props.fields, selectedFieldsMap]);

  const noSelectedFieldsInfo = React.useMemo(() => {
    return props.fields.filter((field) => selectedFieldsMap[field.name] == undefined);
  }, [props.fields, selectedFieldsMap]);

  const handleSelectChange = React.useCallback((field: FilterFieldType) => {
    setOpen(false);
    setNewFilter(field.name);
    setSelectedFields((prev) => [...prev, field]);
  }, []);

  const handleRemoveField = React.useCallback(
    (field: FilterFieldType) => {
      setOpen(false);
      setNewFilter("");
      setSelectedFields((prev) => prev.filter((prevField) => prevField.name !== field.name));
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
    if (!!props.fields?.length && props.initialValues) {
      const initialFields: FilterFieldType[] = [];
      const fieldsMap = arrayToMapByKey(props.fields, "name");

      for (const [key, value] of Object.entries(props.initialValues)) {
        if (value == undefined) continue;

        const currentField = fieldsMap[key];
        if (currentField) initialFields.push(currentField);
      }

      setSelectedFields([...initialFields]);
    }
  }, [props.fields, props.initialValues]);

  return (
    <>
      {selectedFieldsInfo.map((field) => (
        <PopoverField
          key={field.name}
          form={props.form}
          newFilter={newFilter === field.name}
          onRemove={() => handleRemoveField(field)}
          field={field}
        />
      ))}
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
          icon={<Filter />}
          disabled={props.isDisabledFields || props.fields.length === selectedFields.length}
          shape="round"
          type="default"
        >
          {props.filterLabel}
        </Button>
      </Popover>
    </>
  );
});
