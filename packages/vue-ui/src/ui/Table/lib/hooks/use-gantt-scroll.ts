import { type ComputedRef, ref, watch } from "vue";
import { extractDnDPosition } from "../../../../lib";
import {
  GANTT_GRAPH_BODY_ID,
  GANTT_GRAPH_HEADER_ID,
  GANTT_TABLE_BODY_ID,
  GANTT_TABLE_HEADER_ID,
  MAX_SCROLL_WIDTH,
} from "../../constants";

type UseGanttScrollOptions = {
  tableScrollElement: ComputedRef<HTMLDivElement | null | undefined>;
  graphScrollElement: ComputedRef<HTMLDivElement | null | undefined>;
  tableElement: ComputedRef<HTMLDivElement | null | undefined>;
  graphElement: ComputedRef<HTMLDivElement | null | undefined>;
};

type ScrollElements = {
  body: HTMLElement;
  header: HTMLElement;
  bodyContainer: HTMLElement;
  headerContainer: HTMLElement;
  thumb: HTMLElement;
  scroll: HTMLElement;
};

export function useGanttScroll(opts: UseGanttScrollOptions) {
  const tableScroll = ref(false);
  const graphScroll = ref(false);

  watch(
    () => [opts.tableElement.value, opts.tableScrollElement.value, tableScroll.value] as const,
    watchScroll(
      GANTT_TABLE_BODY_ID,
      GANTT_TABLE_HEADER_ID,
      (scroll) => (tableScroll.value = scroll),
    ),
    { immediate: true, flush: "pre" },
  );

  watch(
    () => [opts.graphElement.value, opts.graphScrollElement.value, graphScroll.value] as const,
    watchScroll(
      GANTT_GRAPH_BODY_ID,
      GANTT_GRAPH_HEADER_ID,
      (scroll) => (graphScroll.value = scroll),
    ),
    { immediate: true, flush: "pre" },
  );
}

function watchScroll(bodyId: string, headerId: string, setScroll: (scroll: boolean) => void) {
  return function watchScroll(
    [element, scrollElement, scroll]: readonly [
      HTMLDivElement | null | undefined,
      HTMLDivElement | null | undefined,
      boolean,
    ],
    _:
      | readonly [HTMLDivElement | null | undefined, HTMLDivElement | null | undefined, boolean]
      | undefined,
    clean: (cleanupFn: () => void) => void,
  ) {
    if (!element || !scrollElement) return;

    const bodyContainer = element.querySelector<HTMLDivElement>(`#${bodyId}`);
    const headerContainer = element.querySelector<HTMLDivElement>(`#${headerId}`);
    const body = bodyContainer?.firstChild as HTMLDivElement | undefined;
    const header = headerContainer?.firstChild as HTMLDivElement | undefined;
    const thumb = scrollElement?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!bodyContainer || !headerContainer || !body || !header || !thumb) return;

    const elements: ScrollElements = {
      body,
      bodyContainer,
      header,
      headerContainer,
      thumb,
      scroll: scrollElement,
    };

    const eventController = new AbortController();
    const resizeObserver = new ResizeObserver(resizeObserve(elements, setScroll));
    resizeObserver.observe(bodyContainer);
    resizeObserver.observe(body);

    if (scroll) {
      body.addEventListener("wheel", onWheel(elements), {
        passive: false,
        signal: eventController.signal,
      });
      header.addEventListener("wheel", onWheel(elements), {
        passive: false,
        signal: eventController.signal,
      });
      thumb.addEventListener("mousedown", onDragStart(elements));
      thumb.addEventListener("touchstart", onDragStart(elements), { passive: false });
    }

    clean(() => {
      resizeObserver.disconnect();
      eventController.abort();
    });
  };
}

function resizeObserve(elements: ScrollElements, setScroll: (scroll: boolean) => void) {
  return () => {
    const contentWidth = elements.body.scrollWidth;
    const visibleWidth = elements.bodyContainer.clientWidth;

    if (contentWidth - visibleWidth <= MAX_SCROLL_WIDTH) {
      setScroll(false);
      elements.thumb.style.display = "none";
    } else {
      const ratio = visibleWidth / contentWidth;

      elements.thumb.style.display = "flex";
      elements.thumb.style.width = `${ratio * 100}%`;
      setScroll(true);
      updateScroll(elements);
    }
  };
}

function onDragStart(elements: ScrollElements) {
  return function onDragStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    const eventController = new AbortController();
    const { clientX: startClientX } = extractDnDPosition(event);
    const thumbLeft = parseInt(elements.thumb.style.left, 10);

    function onDragMove(event: MouseEvent | TouchEvent) {
      const trackWidth = elements.scroll.clientWidth;
      const thumbWidth = elements.thumb.clientWidth;
      const maxLeft = trackWidth - thumbWidth;
      const { clientX } = extractDnDPosition(event);

      const left = Math.max(0, Math.min(thumbLeft + clientX - startClientX, maxLeft));
      elements.thumb.style.left = `${left}px`;

      const scrollPercent = left / maxLeft;
      const scroll =
        (elements.body.scrollWidth - elements.bodyContainer.clientWidth) * scrollPercent;
      elements.bodyContainer.scrollLeft = scroll;
      elements.headerContainer.scrollLeft = scroll;
    }

    function onDragEnd() {
      eventController.abort();
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
  };
}

function onWheel(elements: ScrollElements) {
  return function onWheel(event: WheelEvent) {
    if (!event.shiftKey) return;

    event.preventDefault();

    elements.bodyContainer.scrollLeft += event.deltaY;
    elements.headerContainer.scrollLeft += event.deltaY;

    updateScroll(elements);
  };
}

function updateScroll(elements: ScrollElements) {
  const scrollPercent =
    elements.bodyContainer.scrollLeft /
    (elements.body.scrollWidth - elements.bodyContainer.clientWidth);
  const trackWidth = elements.scroll.clientWidth - elements.thumb.clientWidth;

  elements.thumb.style.left = `${scrollPercent * trackWidth}px`;
}
