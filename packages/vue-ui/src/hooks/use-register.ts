import { onMounted, onUnmounted } from "vue";

type Fn = () => void;
export function useRegister(cb: (signal: AbortSignal) => Fn | undefined | null) {
  const eventController = new AbortController();
  let cleanup: Fn | undefined | null;

  onMounted(() => {
    cleanup = cb(eventController.signal);
  });

  onUnmounted(() => {
    eventController.abort();
    cleanup?.();
  });
}
