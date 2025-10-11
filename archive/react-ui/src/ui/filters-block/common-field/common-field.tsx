import { DeleteOutlined } from "@krainovsd/react-icons";
import { Form, type FormInstance } from "antd";
import type { FC } from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Input } from "../../input";
import type { FilterFieldType } from "../types";
import styles from "./common-field.module.scss";

interface IProps {
  field: FilterFieldType;
  newFilter: boolean;
  onRemove: () => void;
  form?: FormInstance;
}

export const CommonField: FC<IProps> = (props) => {
  // const fieldValue = Form.useWatch(props.field.name, props.form) as FilterInputValueType;

  // const displayValue = React.useMemo(() => {
  //   if (fieldValue) {
  //     if (props.field.labelInValue && props.field.renderDisplayValue) {
  //       return props.field.renderDisplayValue(fieldValue);
  //     }

  //     return props.field.renderDisplayValue
  //       ? props.field.renderDisplayValue(fieldValue)
  //       : // eslint-disable-next-line @typescript-eslint/no-base-to-string
  //         String(fieldValue);
  //   }
  // }, [fieldValue, props.field]);

  return (
    <Flex align="center" gap={8}>
      <Form.Item
        name={props.field.name}
        rules={props.field.rules}
        noStyle
        style={{ minWidth: 200 }}
      >
        {props.field.inputField ?? <Input placeholder={props.field.label} />}
      </Form.Item>
      <Button
        style={{
          width: 12,
          height: 12,
        }}
        className={styles.delete}
        onClick={(event) => {
          event.stopPropagation();
          props.onRemove();
        }}
        type="link"
        shape="default"
        icon={<DeleteOutlined style={{ opacity: 0.5 }} size={18} />}
      />
    </Flex>
  );
};
