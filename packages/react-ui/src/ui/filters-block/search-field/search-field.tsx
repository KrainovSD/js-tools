import { Close, Search } from "@krainovsd/react-icons";
import { ConfigProvider, type InputRef, theme } from "antd";
import clsx from "clsx";
import debounce from "lodash/debounce";
import React, { type ChangeEvent, type JSX, memo, useState } from "react";
import { Button } from "../../button";
import { Flex } from "../../flex";
import { Input } from "../../input";
import styles from "./search-field.module.scss";

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
  const isFirstRender = React.useRef(true);

  const onChangeSearchDebounced = debounce((value: string) => {
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
    isFirstRender.current = false;
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
        <Button icon={<Search color={token.colorText} size={16} />} onClick={onOpen} onlyIcon />
      </ConfigProvider>
      <Input
        ref={inputRef}
        className={clsx(
          styles.input,
          isOpen && styles.showing,
          !isOpen && styles.hiding,
          isFirstRender.current && styles.hide,
        )}
        placeholder={searchPlaceholder}
        value={inputValue}
        onChange={handleSearchChange}
        suffix={
          isOpen ? (
            <ConfigProvider wave={{ disabled: true }}>
              <Button
                icon={<Close color="black" size={12} />}
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
