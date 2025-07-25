import type { ValueOf } from "@krainovsd/js-helpers";

export const DND_EVENT_BUS_MESSAGE_TYPES = {
  StartDrag: "startDrag",
  StopDrag: "stopDrag",
  EnterDrag: "enterDrag",
  LeaveDrag: "leaveDrag",
  Position: "position",
} as const;

export type DragInfo<Meta extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  uniqueId: string;
  group: string;
  meta?: Meta;
};

type DnDMessageType = ValueOf<typeof DND_EVENT_BUS_MESSAGE_TYPES>;
type Handlers = {
  [DND_EVENT_BUS_MESSAGE_TYPES.StartDrag]?: (payload: DragInfo) => void;
  [DND_EVENT_BUS_MESSAGE_TYPES.StopDrag]?: (payload: DragInfo) => void;
  [DND_EVENT_BUS_MESSAGE_TYPES.Position]?: (position: { x: number; y: number }) => void;
  [DND_EVENT_BUS_MESSAGE_TYPES.EnterDrag]?: (payload: DragInfo) => void;
  [DND_EVENT_BUS_MESSAGE_TYPES.LeaveDrag]?: (payload: DragInfo) => void;
};

function createDnDEventBug() {
  const handlers: Record<string, Record<string, Handlers>> = {};

  function subscribe(id: string, group: string, subscribedHandlers: Handlers) {
    if (!handlers[group]) {
      handlers[group] = {};
    }

    handlers[group][id] = subscribedHandlers;
  }

  function unsubscribe(id: string, group: string) {
    if (handlers[group]?.[id]) {
      delete handlers[group][id];

      if (Object.keys(handlers[group]).length === 0) {
        delete handlers[group];
      }
    }
  }

  function sendMessage<T extends DnDMessageType>(
    type: T,
    payload: Parameters<Required<Handlers>[T]>[0],
    group: string,
    id?: string,
  ) {
    if (id == undefined) {
      const groupHandlersMap = handlers[group] ?? {};

      for (const groupHandlers of Object.values(groupHandlersMap)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        groupHandlers[type]?.(payload as any);
      }
    } else {
      const handler = handlers[group]?.[id]?.[type];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler?.(payload as any);
    }
  }

  return { subscribe, unsubscribe, sendMessage };
}

export const DND_EVENT_BUS = createDnDEventBug();
