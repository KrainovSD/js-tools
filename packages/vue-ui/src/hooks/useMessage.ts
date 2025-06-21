import { inject } from "vue";
import type { Message } from "../ui/Message.vue";

export const SET_MESSAGE_INJECT_TOKEN = Symbol("message");

export function useMessage() {
  const createMessage =
    inject<
      (message: string, options: Pick<Message, "duration" | "type"> & { id?: number }) => number
    >(SET_MESSAGE_INJECT_TOKEN);

  if (!createMessage) throw new Error("Required message context");

  return createMessage;
}
