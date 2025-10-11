import type { FormItemProps as FormItemPropsAntd } from "antd";
import FormItemAntd from "antd/es/form/FormItem";
import clsx from "clsx";
import styles from "./form-item.module.scss";

export interface FormItemProps extends FormItemPropsAntd {
  wide?: boolean;
}

export function FormItem(props: FormItemProps) {
  const { children, className, wide, ...rest } = props;

  return (
    <FormItemAntd {...rest} className={clsx(className, wide && styles.wide)}>
      {children}
    </FormItemAntd>
  );
}
