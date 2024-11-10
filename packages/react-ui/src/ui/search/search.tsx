import { Icon } from "@krainovsd/icons";
import { type InputProps, Tag, theme } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../config";
import type { TagOption } from "../../typings";
import { Button } from "../button";
import { Flex } from "../flex";
import { Input } from "../input";
import * as styles from "./styles";

type Props = {
  search: string;
  setSearch: (search: string) => void;
  variant?: InputProps["variant"];
  tags?: TagOption[];
  selectedTags?: string[];
  setSelectedTag?: (tag: string, checked: boolean) => void;
  clearTags?: () => void;
};

export function Search({
  search,
  setSearch,
  tags,
  selectedTags,
  setSelectedTag,
  variant = "filled",
  clearTags,
}: Props) {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [isOpenTags, setIsOpenTags] = React.useState(false);

  return (
    <Flex gap={12} vertical>
      <Flex gap={7}>
        <Input
          variant={variant}
          placeholder={t("common.search.input")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suffix={<Icon icon="Search" color={COLORS.greyPrimary} size={13} />}
          shape="circle"
        />
        {tags && (
          <Button
            type="text"
            className={styles.button}
            icon={
              isOpenTags ? (
                <Icon icon="Close" color={token.colorIcon} size={16} />
              ) : (
                <Icon icon="Filter" color={token.colorIcon} size={16} />
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
                  onClick={() => setSelectedTag?.(tag.value, checked)}
                  color={tag.colorBg}
                  style={{
                    color: tag.color,
                    border: checked ? `1px solid ${tag.color}` : `1px solid transparent`,
                    cursor: "pointer",
                  }}
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
