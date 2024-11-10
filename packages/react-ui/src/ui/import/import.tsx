import React from "react";
import { Flex } from "../flex";
import { styles } from "./styles";

type Props = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  accept?: string;
};

export function Import(props: React.PropsWithChildren<Props>) {
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
