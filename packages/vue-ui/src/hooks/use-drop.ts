import { randomString } from "@krainovsd/js-helpers";
import {
  type ComponentPublicInstance,
  type ComputedRef,
  type Ref,
  computed,
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

  const uniqueId = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dropRef.value;

    return `${DROP_PREFIX_ID}${randomString(5)}:${props.group}${props.id.value}`;
  });

  function collectDropRef(node: Element | ComponentPublicInstance | null) {
    dropRef.value = node;
  }

  watch(
    uniqueId,
    (uniqueId, _, clean) => {
      const dropNode = dropRef.value;
      if (!(dropNode instanceof HTMLElement)) return;

      dropNode.setAttribute(DROP_UNIQUE_ID_ATTRIBUTE, uniqueId);
      dropNode.setAttribute(DROP_ID_ATTRIBUTE, props.id.value);
      dropNode.setAttribute(DROP_GROUP_ATTRIBUTE, props.group);

      DND_EVENT_BUS.subscribe(uniqueId, props.group, {
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
        DND_EVENT_BUS.unsubscribe(uniqueId, props.group);
      });
    },
    { immediate: true },
  );

  return { dragOver, canDrop, dropRef: collectDropRef };
}
