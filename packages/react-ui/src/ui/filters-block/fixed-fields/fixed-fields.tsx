import { Form } from "antd";
import type { FC } from "react";
import type { FilterFieldType } from "../types";

interface IProps {
  fields: FilterFieldType[];
}

export const FixedFields: FC<IProps> = (props) => {
  return (
    <>
      {props.fields.map((field) => (
        <Form.Item name={field.name} rules={field.rules} key={field.name}>
          {field.inputField}
        </Form.Item>
      ))}
    </>
  );
};
