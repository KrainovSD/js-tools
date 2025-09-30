import { watch } from "vue";

type UseWatchDebugOptions = {
  caption?: string;
  clone?: boolean;
};
export function useWatchDebug(
  value: unknown,
  { clone = true, caption }: UseWatchDebugOptions = {},
) {
  watch(
    value as Record<string, unknown>,
    (value) => {
      let clonedValue = value;

      if (!(value instanceof HTMLElement) && clone)
        try {
          clonedValue = JSON.parse(JSON.stringify(clonedValue));
        } catch {}
      // eslint-disable-next-line no-console
      console.log(clonedValue, caption);
    },
    { immediate: true, deep: true },
  );
}
