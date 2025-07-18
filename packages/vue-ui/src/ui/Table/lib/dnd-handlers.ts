import { DND_EVENT_BUS, DND_EVENT_BUS_MESSAGE_TYPES } from "./dnd-event-bus";

function createDnDHandlers(idAttribute: string) {
  let dragging = false;

  function handleDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
      if (!id) return;

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
      DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.StartDrag);
      dragging = true;
    }
  }

  function handleDragEnd(event: DragEvent) {
    event.preventDefault();
    const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
    if (!id) return;
    DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.StopDrag);
    dragging = false;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDragEnter(event: DragEvent) {
    if (!dragging) return;

    const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);

    if (!id) return;
    DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.EnterDrag);
  }

  function handleDragLeave(event: DragEvent) {
    if (!dragging) return;

    if (
      event.relatedTarget &&
      !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)
    ) {
      const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
      if (!id) return;
      DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.LeaveDrag);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (!dragging) return { source: undefined, target: undefined };

    const source = event.dataTransfer?.getData?.("text");
    const target = (event.currentTarget as HTMLElement).getAttribute(idAttribute);

    if (target) {
      DND_EVENT_BUS.sendMessage(target, DND_EVENT_BUS_MESSAGE_TYPES.LeaveDrag);
    }

    return {
      source,
      target,
    };
  }

  return {
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
  };
}

export const HEADER_CELL_DND_HANDLERS = createDnDHandlers("data-column-id");
export const ROW_DND_HANDLERS = createDnDHandlers("data-row-id");
