import { Icon } from "@krainovsd/icons";
import { ksdu } from "@krainovsd/utils";
import { type FormInstance, theme } from "antd";
import React from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Popover } from "../../popover";
import { PopoverField } from "../popover-field";
import type { FilterFieldType, FilterInputValueType } from "../types";
import * as styles from "./styles";

const typedMemo: <T>(c: T) => T = React.memo;

type Props<T extends Record<string, FilterInputValueType>> = {
  fields: FilterFieldType[];
  initialValues?: Partial<T>;
  onValuesChange: (values: T) => void;
  form: FormInstance<T>;
  isDisabledFields?: boolean;
  filterLabel: string;
};
export const PopoverFields = typedMemo(function PopoverFields<
  T extends Record<string, FilterInputValueType>,
>(props: Props<T>) {
  const { token } = theme.useToken();
  const [open, setOpen] = React.useState(false);
  const [newFilter, setNewFilter] = React.useState("");
  const [selectedFields, setSelectedFields] = React.useState<FilterFieldType[]>([]);

  const selectedFieldsMap = React.useMemo(() => {
    return ksdu.utils.arrayToMapByKey(selectedFields, "name");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      props.form.setFieldValue(field.name as any, undefined);

      if (props.onValuesChange) {
        const currentValues = props.form.getFieldsValue();
        props.onValuesChange(currentValues);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.form, props.onValuesChange],
  );

  React.useEffect(() => {
    if (!!props.fields?.length && props.initialValues) {
      const initialFields: FilterFieldType[] = [];
      const fieldsMap = ksdu.utils.arrayToMapByKey(props.fields, "name");

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
          icon={<Icon icon="Filter" color={token.colorTextDescription} />}
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
