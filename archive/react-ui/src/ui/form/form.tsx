import { Form as AntdForm } from "antd";
import type { FormProps as AntdFormProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";

export interface FormProps extends AntdFormProps {}

export function Form(props: React.PropsWithChildren<FormProps>): JSX.Element {
  const { children, className, ...rest } = props;

  return (
    <AntdForm {...rest} className={clsx(className)}>
      {children}
    </AntdForm>
  );
}
