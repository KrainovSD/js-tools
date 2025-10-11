import { theme } from "antd";
import type { ReactNode } from "react";
import type React from "react";
import * as styles from "./styles";

interface TableDownBarProps {
  children: ReactNode | ReactNode[];
  className?: string;
  float?: boolean;
  pagination: boolean;
}

export function TableDownBar(props: TableDownBarProps): React.JSX.Element {
  const { children, pagination } = props;
  const { token } = theme.useToken();

  return <div className={styles.base(token, pagination)}>{children}</div>;
}
