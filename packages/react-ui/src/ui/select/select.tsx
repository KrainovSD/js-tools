import { Select as AntdSelect, theme } from "antd";
import type { SelectProps as AntdSelectProps } from "antd";
import type { DefaultOptionType, SelectValue } from "antd/es/select";
import clsx from "clsx";
import type React from "react";
import { type ReactElement, useCallback, useMemo } from "react";
import { Flex } from "../flex";
import { Spin } from "../spin";
import styles from "./select.module.scss";

export interface SelectItemInterface {
  label: string;
  value: number | string | null;
  color?: string;
}

export type SelectItems = SelectItemInterface[];

export interface SelectProps extends AntdSelectProps {
  customOption?: React.JSX.Element;
  withEmptyOption?: boolean;
  wide?: boolean;
}

const EMPTY_OPTION = {
  label: "—",
  value: "EMPTY_VALUE",
};

export function Select(props: SelectProps): React.JSX.Element {
  const {
    withEmptyOption,
    loading,
    customOption,
    options,
    wide,
    onChange,
    className,
    ...otherProps
  } = props;
  const { token } = theme.useToken();

  const dropdownContentRender = useCallback(
    (menu: ReactElement) => (
      <>
        {loading ? (
          <Flex
            align="center"
            justify="center"
            className={styles.content}
            style={{ padding: token.paddingSM }}
          >
            <Spin />
          </Flex>
        ) : (
          <>
            {menu}
            {customOption || null}
          </>
        )}
      </>
    ),
    [loading, token, customOption],
  );

  const selectOptions = useMemo(
    () => (withEmptyOption ? [...(options || []), EMPTY_OPTION] : options),
    [withEmptyOption, options],
  );

  const handleChange = (value: SelectValue, option?: DefaultOptionType | DefaultOptionType[]) => {
    onChange?.(value === EMPTY_OPTION.value ? undefined : value, option);
  };

  return (
    <AntdSelect
      {...otherProps}
      onChange={handleChange}
      value={props.value === undefined && withEmptyOption ? "" : (props.value as SelectValue)}
      options={selectOptions}
      dropdownRender={dropdownContentRender}
      className={clsx(styles.base, wide && styles.wide, className)}
    />
  );
}
