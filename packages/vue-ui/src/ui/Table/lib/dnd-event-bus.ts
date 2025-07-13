import type { ValueOf } from "@krainovsd/js-helpers";

export const DND_EVENT_BUS_MESSAGE_TYPES = {
  StartDrag: "startDrag",
  StopDrag: "stopDrag",
  EnterDrag: "enterDrag",
  LeaveDrag: "leaveDrag",
} as const;

type DnDMessageType = ValueOf<typeof DND_EVENT_BUS_MESSAGE_TYPES>;
type Handler = (() => unknown) | undefined;
type Handlers = Partial<Record<DnDMessageType, Handler>>;

function createDnDEventBug() {
  const handlers: Record<string, Handlers> = {};

  function subscribe(id: string, subscribedHandlers: Handlers) {
    handlers[id] = subscribedHandlers;
  }

  function unsubscribe(id: string) {
    if (handlers[id]) {
      delete handlers[id];
    }
  }

  function sendMessage(id: string, type: DnDMessageType) {
    const handler = handlers[id]?.[type];
    handler?.();
  }

  return { subscribe, unsubscribe, sendMessage };
}

export const DND_EVENT_BUS = createDnDEventBug();
