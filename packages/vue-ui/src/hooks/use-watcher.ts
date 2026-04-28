import { type ComponentPublicInstance, onMounted, shallowRef } from "vue";
import { getWatchedNode } from "../lib";

export function useWatcher() {
  const watcherRef = shallowRef<Element | ComponentPublicInstance | null>(null);
  const targetNode = shallowRef<HTMLElement | null | undefined>(null);

  function extractWatcher(node: Element | ComponentPublicInstance | null) {
    watcherRef.value = node;
  }

  function updateTargetNode() {
    const watcher = watcherRef.value;
    if (!(watcher instanceof HTMLElement) || !watcher?.parentNode) return;
    const observingNode = getWatchedNode(watcher);
    targetNode.value = observingNode;
  }

  onMounted(() => {
    updateTargetNode();
  });

  return {
    watcherRef: extractWatcher,
    updateTargetNode,
    targetNode,
  };
}
