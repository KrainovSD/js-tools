import { Close, Filter, Search as SearchIcon } from "@krainovsd/react-icons";
import { type InputProps, theme } from "antd";
import React from "react";
import { Button } from "../button";
import { Flex } from "../flex";
import { Input } from "../input";
import { Tag } from "../tag";
import styles from "./search.module.scss";

export type TagOption = {
  label: string;
  value: string;
  colorBg: string;
  color: string;
};

type Props = {
  label: string;
  search: string;
  setSearch: (search: string) => void;
  shape?: "square" | "circle";
  variant?: InputProps["variant"];
  tags?: TagOption[];
  selectedTags?: string[];
  setSelectedTag?: (tags: string[]) => void;
  clearTags?: () => void;
};

export function Search({
  search,
  setSearch,
  tags,
  selectedTags,
  setSelectedTag,
  variant = "outlined",
  clearTags,
  label,
  shape = "square",
}: Props) {
  const { token } = theme.useToken();
  const [isOpenTags, setIsOpenTags] = React.useState(false);

  const onTagSelect = React.useCallback(
    (selectedTag: string, checked: boolean) => {
      if (checked) {
        setSelectedTag?.(selectedTags?.filter?.((tag) => tag !== selectedTag) || []);
      } else {
        setSelectedTag?.([...(selectedTags || []), selectedTag]);
      }
    },
    [selectedTags, setSelectedTag],
  );

  return (
    <Flex gap={12} vertical wide>
      <Flex gap={7} wide>
        <Input
          variant={variant}
          placeholder={label}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suffix={<SearchIcon color={"#8893a4"} size={13} />}
          shape={shape}
        />
        {tags && (
          <Button
            type="text"
            className={styles.button}
            icon={
              isOpenTags ? (
                <Close color={token.colorIcon} size={16} />
              ) : (
                <Filter color={token.colorIcon} size={16} />
              )
            }
            onClick={() => {
              if (isOpenTags) clearTags?.();
              setIsOpenTags((prev) => !prev);
            }}
          />
        )}
      </Flex>
      {isOpenTags && (
        <Flex wrap gap={4} align="start">
          {tags &&
            tags.map((tag) => {
              const checked = Boolean(selectedTags && selectedTags.includes(tag.value));

              return (
                <Tag
                  key={tag.value}
                  onClick={() => onTagSelect(tag.value, checked)}
                  color={tag.colorBg}
                  mainColor={tag.color}
                  checked={checked}
                >
                  {tag.label}
                </Tag>
              );
            })}
        </Flex>
      )}
    </Flex>
  );
}
