import { inject } from "vue";
import type { Notification } from "../ui";

export const SET_NOTIFICATION_INJECT_TOKEN = Symbol("notification");

export function useNotification() {
  const createNotification = inject<
    (
      message: string,
      title: string,
      options?: Pick<
        Notification,
        | "duration"
        | "type"
        | "cancelButton"
        | "okButton"
        | "cancelButtonHandler"
        | "okButtonHandler"
        | "onClose"
      > & {
        id?: number;
      },
    ) => number
  >(SET_NOTIFICATION_INJECT_TOKEN);

  if (!createNotification) throw new Error("Required notification context");

  return createNotification;
}
