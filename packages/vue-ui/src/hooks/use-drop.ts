import {
  type ComponentPublicInstance,
  type ComputedRef,
  type Ref,
  ref,
  shallowRef,
  watch,
} from "vue";
import { DND_EVENT_BUS, type DragInfo } from "../lib";

export type UseDropOptions<Meta extends Record<string, unknown>> = {
  group: string;
  id: Ref<string> | ComputedRef<string>;
  canDrop?: (dragInfo: DragInfo<Meta>) => boolean | undefined;
};

export const DROP_ID_ATTRIBUTE = "data-drop-id";
export const DROP_UNIQUE_ID_ATTRIBUTE = "data-drop-unique-id";
export const DROP_GROUP_ATTRIBUTE = "data-drop-group";
export const DROP_PREFIX_ID = "drop:";

export function useDrop<Meta extends Record<string, unknown>>(props: UseDropOptions<Meta>) {
  const dragOver = ref(false);
  const canDrop = ref(false);
  const dropRef = shallowRef<Element | ComponentPublicInstance | null>(null);
  function collectDropRef(node: Element | ComponentPublicInstance | null) {
    dropRef.value = node;
  }

  watch<[Element | ComponentPublicInstance | null, string], true>(
    () => [dropRef.value, props.id.value],
    ([dropRef, id], _, clean) => {
      if (!(dropRef instanceof HTMLElement)) return;

      const dropId = `${DROP_PREFIX_ID}${props.group}${id}`;
      dropRef.setAttribute(DROP_UNIQUE_ID_ATTRIBUTE, dropId);
      dropRef.setAttribute(DROP_ID_ATTRIBUTE, id);
      dropRef.setAttribute(DROP_GROUP_ATTRIBUTE, props.group);

      DND_EVENT_BUS.subscribe(dropId, props.group, {
        enterDrag: function enterDrag() {
          dragOver.value = true;
        },
        leaveDrag: function leaveDrag() {
          dragOver.value = false;
        },
        startDrag: function startDrag(dragInfo) {
          if (props.canDrop == undefined || props.canDrop(dragInfo as DragInfo<Meta>)) {
            canDrop.value = true;
          }
        },
        stopDrag: function stopDrag() {
          canDrop.value = false;
        },
      });

      clean(() => {
        DND_EVENT_BUS.unsubscribe(dropId, props.group);
      });
    },
    { immediate: true },
  );

  return { dragOver, canDrop, dropRef: collectDropRef };
}
