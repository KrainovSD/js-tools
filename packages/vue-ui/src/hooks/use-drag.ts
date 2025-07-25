import { isObject } from "@krainovsd/js-helpers";
import {
  type ComponentPublicInstance,
  type ComputedRef,
  type Ref,
  type VNode,
  ref,
  render,
  shallowRef,
  watch,
} from "vue";
import {
  DND_EVENT_BUS,
  DND_EVENT_BUS_MESSAGE_TYPES,
  type DragInfo,
  extractDnDPosition,
} from "../lib";
import { createDndScrollContainerController } from "../lib/dnd-scroll-container-controller";
import { DROP_GROUP_ATTRIBUTE, DROP_ID_ATTRIBUTE, DROP_UNIQUE_ID_ATTRIBUTE } from "./use-drop";

const DRAG_ID_ATTRIBUTE = "data-drag-id";
const DRAG_UNIQUE_ID_ATTRIBUTE = "data-drag-unique-id";
const DRAG_GROUP_ATTRIBUTE = "data-drag-group";
const DRAG_PREFIX_ID = "drag:";

export type UseDragOptions<Meta extends Record<string, unknown>> = {
  group: string;
  id: Ref<string> | ComputedRef<string>;
  dragSelector?: string;
  forbiddenSelector?: string;
  canDrag?: (event: TouchEvent | MouseEvent) => boolean | undefined;
  onDrop?: (sourceId: string, targetId: string) => void;
  dragGhost?: Ref<VNode | HTMLElement> | ComputedRef<VNode | HTMLElement>;
  scrollContainer?:
    | Ref<HTMLElement | null | undefined>
    | ComputedRef<HTMLElement | null | undefined>;
  meta?: Ref<Meta> | ComputedRef<Meta>;
};

type CursorPosition = { x: number; y: number };

export function useDrag<Meta extends Record<string, unknown>>(props: UseDragOptions<Meta>) {
  const dragging = ref(false);
  const dragRef = shallowRef<Element | ComponentPublicInstance | null>(null);
  function collectDragRef(node: Element | ComponentPublicInstance | null) {
    dragRef.value = node;
  }
  const cursorPosition = shallowRef<CursorPosition>({ x: 0, y: 0 });

  watch<[Element | ComponentPublicInstance | null, string, Meta | undefined], true>(
    () => [dragRef.value, props.id.value, props.meta?.value],
    ([dragRef, id, meta], _, clean) => {
      if (!(dragRef instanceof HTMLElement)) return;

      const dragId = `${DRAG_PREFIX_ID}${props.group}${id}`;

      dragRef.setAttribute(DRAG_UNIQUE_ID_ATTRIBUTE, dragId);
      dragRef.setAttribute(DRAG_ID_ATTRIBUTE, id);
      dragRef.setAttribute(DRAG_GROUP_ATTRIBUTE, props.group);

      let dragController: AbortController | undefined;
      function onDragStart(event: TouchEvent | MouseEvent) {
        if (props.canDrag && !props.canDrag(event)) {
          return;
        }
        const target = event.target as HTMLElement;

        /** Cancel if start drag other group */
        const targetGroup = target
          .closest(`[${DRAG_GROUP_ATTRIBUTE}]`)
          ?.getAttribute?.(DRAG_GROUP_ATTRIBUTE);
        if (targetGroup == undefined || targetGroup !== props.group) {
          return;
        }

        if (props.forbiddenSelector && target.closest(props.forbiddenSelector)) {
          return;
        }

        if (props.dragSelector && !target.closest(props.dragSelector)) {
          return;
        }

        handleDragStart(event, {
          group: props.group,
          id,
          meta,
          uniqueId: dragId,
        });
        if (dragScrollController) {
          dragScrollController.stopScrollElement();
        }
        if (props.scrollContainer?.value) {
          dragScrollController = createDndScrollContainerController(props.scrollContainer.value);
        }
        dragGhost = props.dragGhost?.value;
        dragController = new AbortController();
        if (event instanceof TouchEvent) {
          document.addEventListener("touchmove", handleDragMove, {
            passive: false,
            signal: dragController.signal,
          });
          document.addEventListener("touchend", onDragEnd, { signal: dragController.signal });
        } else {
          document.addEventListener("mousemove", handleDragMove, {
            passive: false,
            signal: dragController.signal,
          });
          document.addEventListener("mouseup", onDragEnd, { signal: dragController.signal });
        }
      }
      function onDragEnd(event: TouchEvent | MouseEvent) {
        const { dragId, dropId } = handleDragEnd(event);

        if (dragId != undefined && dropId != undefined) {
          props.onDrop?.(dragId, dropId);
        }

        dragController?.abort?.();
      }

      dragRef.addEventListener("mousedown", onDragStart);
      dragRef.addEventListener("touchstart", onDragStart, { passive: false });

      DND_EVENT_BUS.subscribe(dragId, props.group, {
        startDrag: function startDrag(dragInfo) {
          if (dragInfo.uniqueId === dragId) {
            dragging.value = true;
          }
        },
        stopDrag: function stopDrag(dragInfo) {
          if (dragInfo.uniqueId === dragId) {
            dragging.value = false;
          }
        },
        position: function position(position) {
          if (isObject(position)) {
            cursorPosition.value = position;
          }
        },
      });

      clean(() => {
        DND_EVENT_BUS.unsubscribe(dragId, props.group);
        dragRef.removeEventListener("mousedown", onDragStart);
        dragRef.removeEventListener("touchstart", onDragStart);
      });
    },
    { immediate: true },
  );

  return { dragging, cursorPosition, dragRef: collectDragRef };
}

let dragScrollController: ReturnType<typeof createDndScrollContainerController> | undefined;
let dragGhost: VNode | HTMLElement | undefined;
let dragGhostContainer: HTMLDivElement | undefined;
let dragInfoStart: DragInfo | undefined;
let dragInfo: DragInfo | undefined;
let dragOver: string | undefined;

type HandleDragStartOptions<Meta extends Record<string, unknown>> = {
  id: string;
  uniqueId: string;
  group: string;
  meta: Meta | undefined;
};

function handleDragStart<Meta extends Record<string, unknown>>(
  event: TouchEvent | MouseEvent,
  opts: HandleDragStartOptions<Meta>,
) {
  // const id = (event.currentTarget as HTMLElement).getAttribute(DRAG_ID_ATTRIBUTE);
  // const uniqueId = (event.currentTarget as HTMLElement).getAttribute(DRAG_UNIQUE_ID_ATTRIBUTE);
  // const group = (event.currentTarget as HTMLElement).getAttribute(DRAG_GROUP_ATTRIBUTE);

  if (
    ("touches" in event && event.touches.length > 1) ||
    opts.id == undefined ||
    opts.uniqueId == undefined ||
    opts.group == undefined
  )
    return;

  const { clientX, clientY } = extractDnDPosition(event);
  DND_EVENT_BUS.sendMessage(
    DND_EVENT_BUS_MESSAGE_TYPES.Position,
    {
      x: clientX,
      y: clientY,
    },
    opts.group,
    opts.uniqueId,
  );
  dragInfoStart = opts;
}

function handleDragMove(event: TouchEvent | MouseEvent) {
  if (dragInfoStart) {
    /** Start Drag logic */
    dragInfo = dragInfoStart;
    DND_EVENT_BUS.sendMessage(DND_EVENT_BUS_MESSAGE_TYPES.StartDrag, dragInfo, dragInfo.group);
    dragInfoStart = undefined;
    document.body.classList.add("dragging");

    if (dragGhost) {
      /** Render drag ghost element */
      const ghostContainerElement = document.createElement("div");
      ghostContainerElement.style.position = "absolute";
      ghostContainerElement.style.pointerEvents = "none";
      ghostContainerElement.style.zIndex = "1000";

      document.body.appendChild(ghostContainerElement);
      if (dragGhost instanceof HTMLElement) {
        dragGhostContainer?.appendChild(dragGhost);
      } else {
        render(dragGhost, ghostContainerElement);
      }
      dragGhostContainer = ghostContainerElement;
    }
  }

  if (dragScrollController) {
    dragScrollController.stopScrollElement();
  }

  if (!dragInfo) return;

  /** Send Cursor Position */
  const { clientX, clientY } = extractDnDPosition(event);
  DND_EVENT_BUS.sendMessage(
    DND_EVENT_BUS_MESSAGE_TYPES.Position,
    {
      x: clientX,
      y: clientY,
    },
    dragInfo.group,
    dragInfo.uniqueId,
  );

  /** Change position drag ghost */
  if (dragGhostContainer) {
    dragGhostContainer.style.left = `${clientX}px`;
    dragGhostContainer.style.top = `${clientY}px`;
  }

  /** Custom Scroll  */
  if (dragScrollController) {
    dragScrollController.startScrollElement(clientX, clientY);
  }

  /** Prevent Scroll on Touch */
  if (event instanceof TouchEvent) {
    event.preventDefault();
  }

  /** Check drag over node */
  let dropNode: HTMLElement | undefined | null = document.elementFromPoint(
    clientX,
    clientY,
  ) as HTMLElement | null;
  let dropGroup: string | undefined;
  while (dropNode != undefined && dropGroup == undefined) {
    dropNode = dropNode?.closest?.<HTMLElement>(`[${DROP_GROUP_ATTRIBUTE}]`);
    const group = dropNode?.getAttribute?.(DROP_GROUP_ATTRIBUTE);
    if (group === dragInfo.group) {
      dropGroup = group;
    } else {
      dropNode = dropNode?.parentElement;
    }
  }
  const dropUniqueId = dropNode?.getAttribute?.(DROP_UNIQUE_ID_ATTRIBUTE);

  if (
    (dropUniqueId == undefined ||
      dropGroup !== dragInfo.group ||
      (dropUniqueId != undefined && dropGroup === dragInfo.group && dragOver !== dropUniqueId)) &&
    dragOver != undefined
  ) {
    DND_EVENT_BUS.sendMessage(
      DND_EVENT_BUS_MESSAGE_TYPES.LeaveDrag,
      dragInfo,
      dragInfo.group,
      dragOver,
    );
    dragOver = undefined;
  }

  if (dropUniqueId != undefined && dropGroup === dragInfo.group) {
    DND_EVENT_BUS.sendMessage(
      DND_EVENT_BUS_MESSAGE_TYPES.EnterDrag,
      dragInfo,
      dragInfo.group,
      dropUniqueId,
    );
    dragOver = dropUniqueId;
  }
}

function handleDragEnd(event: TouchEvent | MouseEvent) {
  document.body.classList.remove("dragging");
  dragInfoStart = undefined;
  if (dragScrollController) {
    dragScrollController.stopScrollElement();
    dragScrollController = undefined;
  }

  if (dragGhostContainer) {
    if (dragGhost instanceof HTMLElement) {
      dragGhost.remove();
    } else {
      render(null, dragGhostContainer);
    }
    dragGhostContainer.remove();
    dragGhostContainer = undefined;
  }
  if (dragGhost) {
    dragGhost = undefined;
  }

  if (!dragInfo) return {};
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const dragInfoTemp = dragInfo;
  DND_EVENT_BUS.sendMessage(DND_EVENT_BUS_MESSAGE_TYPES.StopDrag, dragInfo, dragInfo.group);
  dragInfo = undefined;

  if (!dragOver) return {};

  const dropNode = document.querySelector(`[${DROP_UNIQUE_ID_ATTRIBUTE}='${dragOver}']`);
  const dropId = dropNode?.getAttribute?.(DROP_ID_ATTRIBUTE);
  const dropGroup = dropNode?.getAttribute?.(DROP_GROUP_ATTRIBUTE);

  DND_EVENT_BUS.sendMessage(
    DND_EVENT_BUS_MESSAGE_TYPES.LeaveDrag,
    dragInfoTemp,
    dragInfoTemp.group,
    dragOver,
  );
  dragOver = undefined;

  if (dropGroup != dragInfoTemp.group || dropId == undefined) return {};

  return { dragId: dragInfoTemp.id, dropId };
}
