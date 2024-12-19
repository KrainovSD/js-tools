import { Icon } from "@krainovsd/icons";
import { ksdu } from "@krainovsd/utils";
import { ConfigProvider, type InputRef, theme } from "antd";
import clsx from "clsx";
import React, { type ChangeEvent, type JSX, memo, useState } from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Input } from "../../input";
import * as styles from "./styles";

interface SearchFieldProps {
  searchPlaceholder?: string;
  onChangeSearch?: (value: string) => void;
}

export const SearchField = memo(function SearchField(props: SearchFieldProps): JSX.Element {
  const { searchPlaceholder, onChangeSearch } = props;
  const { token } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = React.useRef<InputRef>(null);

  const onChangeSearchDebounced = ksdu.utils.debounce((value: string) => {
    if (onChangeSearch) {
      onChangeSearch(value);
    }
  }, 500);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onChangeSearchDebounced(value);
  };

  const onOpen = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const handleCleanClick = () => {
    setInputValue("");
    onChangeSearchDebounced("");
  };

  React.useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  return (
    <Flex gap={10} align="center" className={styles.container}>
      <ConfigProvider wave={{ disabled: true }}>
        <Button
          icon={<Icon icon="Search" color={token.colorText} size={16} />}
          onClick={onOpen}
          onlyIcon
        />
      </ConfigProvider>
      <Input
        ref={inputRef}
        className={clsx(styles.input, isOpen && "showing", !isOpen && "hiding")}
        placeholder={searchPlaceholder}
        value={inputValue}
        onChange={handleSearchChange}
        suffix={
          isOpen ? (
            <ConfigProvider wave={{ disabled: true }}>
              <Button
                icon={<Icon icon="Close" color="black" size={12} />}
                onClick={handleCleanClick}
                onlyIcon
                style={{ display: inputValue ? "flex" : "none" }}
              />
            </ConfigProvider>
          ) : undefined
        }
      />
    </Flex>
  );
});
