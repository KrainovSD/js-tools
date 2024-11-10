import { Icon } from "@krainovsd/icons";
import { ksdu } from "@krainovsd/utils";
import { ConfigProvider, theme } from "antd";
import { type ChangeEvent, type JSX, memo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [clickSearch, setClickSearch] = useState(false);
  const [firstClickSearch, setFirstClickSearch] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

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

  const handleSearchClick = () => {
    setClickSearch((prev) => !prev);
    setFirstClickSearch(true);
  };

  const handleCleanClick = () => {
    setInputValue("");
    onChangeSearchDebounced("");
  };

  const getInputClassName = () => {
    if (clickSearch) return styles.inputSearchShow;
    if (firstClickSearch && !clickSearch) return styles.inputSearchHide;

    return styles.inputSearchDefault;
  };

  return (
    <Flex>
      <ConfigProvider wave={{ disabled: true }}>
        <Button
          icon={<Icon icon="Search" color={token.colorText} />}
          className={styles.searchButton}
          onClick={handleSearchClick}
        />
      </ConfigProvider>
      <Input
        className={getInputClassName()}
        variant="borderless"
        placeholder={searchPlaceholder || t("common.filters.searchPlaceholder")}
        value={inputValue}
        onChange={handleSearchChange}
        suffix={
          <ConfigProvider wave={{ disabled: true }}>
            <Button
              icon={<Icon icon="Close" style={{ color: token.colorIcon }} />}
              onClick={handleCleanClick}
              className={inputValue ? styles.closeButtonShow : styles.closeButtonHide}
            />
          </ConfigProvider>
        }
      />
    </Flex>
  );
});
