import { WarningFilled } from "@krainovsd/react-icons";
import { theme } from "antd";
import type { JSX } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import { Flex } from "../flex";
import { Text, Title } from "../typography";
import styles from "./error-content.module.scss";

export interface ErrorContentProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onClick?: () => unknown;
}

export function ErrorContent(props: ErrorContentProps): JSX.Element {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const {
    title = t("ui.notifications.error.title"),
    description = t("ui.notifications.error.description"),
    buttonLabel = t("ui.notifications.error.button"),
    ...rest
  } = props;

  const onClick = React.useCallback(() => {
    void rest.onClick?.();
  }, [rest]);

  return (
    <div className={styles.wrapper}>
      <Flex vertical align="center" gap={20} className={styles.content}>
        <WarningFilled color={token.colorError} size={60} />
        <Flex vertical align="center" gap="large">
          <Flex vertical gap="small" className={styles.text}>
            <Title level={4}>{title}</Title>
            <Text>{description}</Text>
          </Flex>
          {onClick && buttonLabel && (
            <Button onClick={onClick} type="primary">
              {buttonLabel}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
}
