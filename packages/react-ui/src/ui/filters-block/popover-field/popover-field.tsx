import { CloseCircleFilled } from "@krainovsd/react-icons";
import type { FormInstance } from "antd";
import { Form, theme } from "antd";
import type { FC } from "react";
import React from "react";
import { Flex } from "../../flex";
import { IconWrapper } from "../../icon-wrapper";
import { Input } from "../../input";
import { Popover } from "../../popover";
import { Text } from "../../typography";
import type { FilterFieldType, FilterInputValueType } from "../types";
import * as styles from "./styles";

interface IProps {
  field: FilterFieldType;
  newFilter: boolean;
  onRemove: () => void;
  form?: FormInstance;
}

export const PopoverField: FC<IProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const fieldValue = Form.useWatch(props.field.name, props.form) as FilterInputValueType;
  const { token } = theme.useToken();

  React.useEffect(() => {
    setOpen(props.newFilter);
  }, [props.newFilter]);

  const displayValue = React.useMemo(() => {
    if (fieldValue) {
      if (props.field.labelInValue && props.field.renderDisplayValue) {
        return props.field.renderDisplayValue(fieldValue);
      }

      return props.field.renderDisplayValue
        ? props.field.renderDisplayValue(fieldValue)
        : // eslint-disable-next-line @typescript-eslint/no-base-to-string
          String(fieldValue);
    }
  }, [fieldValue, props.field]);

  return (
    <Popover
      placement="bottomLeft"
      arrow={false}
      destroyTooltipOnHide={true}
      content={
        <Form.Item
          name={props.field.name}
          rules={props.field.rules}
          noStyle
          style={{ minWidth: 200 }}
        >
          {props.field.inputField}
        </Form.Item>
      }
      trigger="click"
      open={open}
      onOpenChange={setOpen}
    >
      <div className={styles.popover(token)}>
        {/* Используется для инициализации формы */}
        <Form.Item name={props.field.name} style={{ display: "none" }}>
          {props.field.inputField ?? <Input placeholder={props.field.label} />}
        </Form.Item>
        <Flex align="center" wrap={false} style={{ color: "currentColor" }} gap={8}>
          {/* <Text type={fieldValue ? "secondary" : undefined}>{props.field.label}:</Text> */}
          <Text color="currentColor">{props.field.label}:</Text>
          <Text color="currentColor" ellipsis={{ tooltip: displayValue }} style={{ maxWidth: 200 }}>
            {displayValue}
          </Text>
          <IconWrapper
            style={{
              color: "currentColor",
            }}
            onClick={(event) => {
              event.stopPropagation();
              props.onRemove();
            }}
          >
            <CloseCircleFilled style={{ opacity: 0.5, transition: "none" }} size={16} />
          </IconWrapper>
        </Flex>
      </div>
    </Popover>
  );
};
