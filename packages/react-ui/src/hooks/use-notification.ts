import { App } from "antd";
import type { ArgsProps } from "antd/lib/notification";

export type NotificationType = "success" | "info" | "warning" | "error";

export function useNotification() {
  const { notification } = App.useApp();

  const showNotification = (type: NotificationType, params: ArgsProps) => {
    notification[type]({ duration: 5, ...params });
  };

  return { showNotification };
}
