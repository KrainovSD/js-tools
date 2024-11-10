import { Modal as AntdModal } from "antd";
import type { ModalProps as AntdModalProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";

export interface ModalProps extends AntdModalProps {}

export function Modal(props: ModalProps): JSX.Element {
  const { className, ...rest } = props;

  return <AntdModal {...rest} className={clsx(className)} />;
}
