import { type ComputedRef, type ShallowRef, computed, ref, shallowRef, watch } from "vue";
import { extractDnDPosition } from "../../../../lib";
import { MIN_GANTT_PART_WIDTH } from "../../constants";

type UseGanttSplitterOptions = {
  instantSizing: ComputedRef<boolean>;
  splitter: Readonly<ShallowRef<HTMLDivElement | null>>;
  ghost: Readonly<ShallowRef<HTMLDivElement | null>>;
  overlay: Readonly<ShallowRef<HTMLDivElement | null>>;
};

export function useGanttSplitter(opts: UseGanttSplitterOptions) {
  const sizes = shallowRef([0, 0]);
  const dragging = ref(false);
  let tempSizes = [0, 0];
  const container = computed(() => opts.splitter.value?.parentElement);

  function getSizesFromPointer(event?: MouseEvent | TouchEvent) {
    const rect = container.value?.getBoundingClientRect();
    if (!rect) return;

    const maxWidth = rect.width - MIN_GANTT_PART_WIDTH;
    const minWidth = MIN_GANTT_PART_WIDTH;
    let size: number | undefined;

    if (event) {
      const { clientX } = extractDnDPosition(event);
      size = clientX - rect.left;
    } else {
      size = tempSizes[0] || rect.width / 2;
    }
    if (size < minWidth) size = minWidth;
    else if (size > maxWidth) size = maxWidth;

    return [Math.round(size), Math.round(rect.width - size)];
  }

  function onDragStart(event: TouchEvent | MouseEvent) {
    if (dragging.value) return;

    const eventController = new AbortController();
    dragging.value = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    if (!opts.instantSizing.value && opts.ghost.value) {
      opts.ghost.value.style.visibility = "visible";
    }

    function onDragEnd(event: MouseEvent | TouchEvent) {
      eventController.abort();
      dragging.value = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (!opts.instantSizing.value) {
        sizes.value = tempSizes;

        if (opts.ghost.value) {
          opts.ghost.value.style.visibility = "hidden";
          opts.ghost.value.style.left = "0px";
        }

        if (opts.overlay.value) {
          const rect = container.value?.getBoundingClientRect();
          if (!rect) return;

          opts.overlay.value.style.width = `${rect.width}px`;
          opts.overlay.value.style.left = `-${rect.width - tempSizes[1]}px`;
        }
      }
    }
    function onDragMove(event: MouseEvent | TouchEvent) {
      if (!dragging.value) return;
      /** Prevent Scroll on Touch */
      if (event instanceof TouchEvent) {
        event.preventDefault();
      }

      const newSizes = getSizesFromPointer(event);
      if (!newSizes) return;

      if (!opts.instantSizing.value) {
        const splitterRect = opts.splitter.value?.getBoundingClientRect();
        const containerRect = container.value?.getBoundingClientRect();
        if (!splitterRect || !containerRect || !opts.ghost.value) return;

        opts.ghost.value.style.left = `${newSizes[0] - splitterRect.left + containerRect.left}px`;
        tempSizes = newSizes;
      } else {
        sizes.value = newSizes;
        tempSizes = newSizes;
      }
    }

    if (event instanceof TouchEvent) {
      document.addEventListener("touchmove", onDragMove, {
        passive: false,
        signal: eventController.signal,
      });
      document.addEventListener("touchend", onDragEnd, { signal: eventController.signal });
    } else {
      document.addEventListener("mousemove", onDragMove, {
        passive: false,
        signal: eventController.signal,
      });
      document.addEventListener("mouseup", onDragEnd, { signal: eventController.signal });
    }
  }

  watch(
    container,
    (container, _, clean) => {
      if (!container) return;
      let parentWidth = 0;

      function updateSize(width: number) {
        if (width === parentWidth) return;

        parentWidth = width;
        const newSizes = getSizesFromPointer();
        if (!newSizes) return;

        sizes.value = newSizes;
        if (!opts.instantSizing.value) {
          tempSizes = newSizes;
          if (opts.ghost.value) {
            opts.ghost.value.style.left = "0px";
          }
          if (opts.overlay.value) {
            opts.overlay.value.style.width = `${width}px`;
            opts.overlay.value.style.left = `-${width - newSizes[1]}px`;
          }
        } else {
          tempSizes = newSizes;
        }
      }
      function onPageResize() {
        const rect = container?.getBoundingClientRect();
        if (rect) {
          updateSize(Math.round(rect.width));
        }
      }

      const resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.target?.clientWidth;
        if (width) {
          updateSize(Math.round(width));
        }
      });
      resizeObserver.observe(container);
      window.addEventListener("resize", onPageResize);

      clean(() => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", onPageResize);
      });
    },
    { immediate: true },
  );

  watch(
    () => opts.splitter.value,
    (splitter, _, clean) => {
      if (!splitter) return;

      splitter.addEventListener("mousedown", onDragStart);
      splitter.addEventListener("touchstart", onDragStart, { passive: false });

      clean(() => {
        splitter.removeEventListener("mousedown", onDragStart);
        splitter.removeEventListener("touchstart", onDragStart);
      });
    },
  );

  return { sizes, dragging };
}
