import { watch } from "vue";

export function useWatchDebug(value: unknown, caption?: string) {
  watch(
    value as Record<string, unknown>,
    (value) => {
      let clonedValue = value;

      if (!(value instanceof HTMLElement))
        try {
          clonedValue = JSON.parse(JSON.stringify(clonedValue));
        } catch {}
      // eslint-disable-next-line no-console
      console.log(clonedValue, caption);
    },
    { immediate: true, deep: true },
  );
}
