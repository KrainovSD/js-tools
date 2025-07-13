import { DND_EVENT_BUS, DND_EVENT_BUS_MESSAGE_TYPES } from "./dnd-event-bus";

function createDnDHandlers(idAttribute: string) {
  function handleDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
      if (!id) return;

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text", id);
      DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.StartDrag);
    }
  }

  function handleDragEnd(event: DragEvent) {
    event.preventDefault();
    const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
    if (!id) return;
    DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.StopDrag);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDragEnter(event: DragEvent) {
    const id = (event.currentTarget as HTMLElement).getAttribute(idAttribute);
    if (!id) return;
    DND_EVENT_BUS.sendMessage(id, DND_EVENT_BUS_MESSAGE_TYPES.EnterDrag);
  }

  function handleDragLeave(event: DragEvent) {
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
    (event.currentTarget as HTMLElement).style.background = "";
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
