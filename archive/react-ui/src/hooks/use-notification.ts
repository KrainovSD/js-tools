import { App } from "antd";
import type { ArgsProps } from "antd/lib/notification";

export type NotificationType = "success" | "info" | "warning" | "error";

export function useNotification() {
  const { notification } = App.useApp();

  const showNotification = (type: NotificationType, params: ArgsProps) => {
    const { duration = 3, showProgress = true, closable = true, ...rest } = params;

    notification[type]({ ...rest, duration, showProgress, closable });
  };

  return { showNotification };
}
