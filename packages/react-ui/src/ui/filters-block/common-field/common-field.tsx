import type { FormInstance } from "antd";
import type { FC } from "react";
import { Input } from "../../input";
import type { FilterFieldType } from "../types";

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

  return <>{props.field.inputField ?? <Input placeholder={props.field.label} />}</>;
};
