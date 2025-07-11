import { watch } from "vue";

export function useWatchDebug(value: unknown, caption?: string) {
  watch(
    value as Record<string, unknown>,
    (value) => {
      // eslint-disable-next-line no-console
      console.log(value, caption);
    },
    { immediate: true },
  );
}
