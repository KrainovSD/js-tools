import { Icon } from "@krainovsd/icons";
import { Form, theme } from "antd";
import { type JSX, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import { Flex } from "../flex";
import { Popover } from "../popover";
import { FixedFields } from "./fixed-fields";
import { PopoverField } from "./popover-field";
import { SearchField } from "./search-field/search-field";
import * as styles from "./styles";
import type { FilterFieldType } from "./types";

interface FiltersBlockProps<T> {
  fields?: FilterFieldType[];
  fixedFields?: FilterFieldType[];
  showSearchField?: boolean;
  searchPlaceholder?: string;
  isDisabledFields?: boolean;
  onValuesChange: (values: T) => void;
  initialValues?: Partial<T>;
  onChangeSearch?: (value: string) => void;
}

export function FiltersBlock<T>(props: FiltersBlockProps<T>): JSX.Element {
  const {
    fields,
    fixedFields,
    showSearchField,
    searchPlaceholder,
    isDisabledFields,
    onValuesChange,
    initialValues,
    onChangeSearch,
  } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [newFilter, setNewFilter] = useState("");
  const [selectedFields, setSelectedFields] = useState<FilterFieldType[]>([]);

  useEffect(() => {
    if (!!fields?.length && initialValues) {
      const initialFields: FilterFieldType[] = [];

      for (const key of Object.keys(initialValues) as (keyof T)[]) {
        const filteredField = fields.find((field) => field?.name === (key as string));

        if (filteredField && initialValues[key] !== undefined) {
          initialFields.push(filteredField);
        }
      }

      setSelectedFields([...initialFields]);
    }
  }, [fields, initialValues]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSelectChange = (field: FilterFieldType) => {
    setOpen(false);
    setNewFilter(field.name);
    setSelectedFields([...selectedFields, field]);
  };

  const handleRemoveField = (cField: FilterFieldType) => {
    setOpen(false);
    setNewFilter("");
    setSelectedFields(selectedFields.filter((field) => field.name !== cField.name));
    form.setFieldValue(cField.name, undefined);

    const currentValues = form.getFieldsValue() as T;

    if (onValuesChange) {
      onValuesChange(currentValues);
    }
  };

  const onChangeFormValues = (_: unknown, values: T) => onValuesChange(values);

  const renderPopoverFields = useCallback(
    (fields: FilterFieldType[]) => (
      <>
        {fields
          .filter((object1) => selectedFields.some((object2) => object1.name === object2.name))
          .map((field) => (
            <PopoverField
              key={field.name}
              form={form}
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
              {fields
                .filter(
                  (object1) => !selectedFields.some((object2) => object1.name === object2.name),
                )
                .map((field) => (
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
          open={fields.length !== selectedFields.length && open}
          onOpenChange={setOpen}
        >
          <Button
            icon={<Icon icon="Filter" color={token.colorTextDescription} />}
            disabled={isDisabledFields || fields.length === selectedFields.length}
            shape="round"
            type="default"
          >
            {t("common.filters.label")}
          </Button>
        </Popover>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      form,
      handleRemoveField,
      handleSelectChange,
      isDisabledFields,
      newFilter,
      open,
      selectedFields,
    ],
  );

  return (
    <Form
      form={form}
      name="filters_form"
      onValuesChange={onChangeFormValues}
      initialValues={initialValues}
      style={{ width: "100%" }}
    >
      <Flex justify="space-between" gap={40} align="flex-start">
        <Flex gap={12} wrap>
          {!!fixedFields?.length && <FixedFields fields={fixedFields} />}
          {fields && fields?.length > 0 && renderPopoverFields(fields)}
        </Flex>

        {showSearchField && (
          <SearchField searchPlaceholder={searchPlaceholder} onChangeSearch={onChangeSearch} />
        )}
      </Flex>
    </Form>
  );
}
