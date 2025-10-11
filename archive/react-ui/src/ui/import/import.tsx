import React from "react";
import { Flex } from "../flex";
import styles from "./import.module.scss";

export type ImportPropsInterface = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  accept?: string;
};

export function Import(props: React.PropsWithChildren<ImportPropsInterface>) {
  const { onChange, children, ...rest } = props;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onClick = React.useCallback(() => {
    if (inputRef.current) inputRef.current.click();
  }, []);

  return (
    <Flex className={styles.base} onClick={onClick}>
      {children}
      <input {...rest} className={styles.input} ref={inputRef} type="file" onChange={onChange} />
    </Flex>
  );
}
