import { watch } from "vue";

export function useWatchDebug(value: unknown) {
  watch(
    value as Record<string, unknown>,
    (value) => {
      // eslint-disable-next-line no-console
      console.log(value);
    },
    { immediate: true },
  );
}
