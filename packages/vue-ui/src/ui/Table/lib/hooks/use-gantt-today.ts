import { dateFormat } from "@krainovsd/js-helpers";
import { type ComputedRef, type ModelRef, type ShallowRef, computed, ref, watch } from "vue";
import { extractDragPosition } from "../../../../lib";
import { MIN_GANTT_TODAY_LEFT } from "../../constants";
import type { GanttHeaderInfo, GanttViewType } from "../../types";
import { getDaysInMonth } from "../get-days-in-month";
import { getDaysInYear } from "../get-days-in-year";
import { getGanttCellMonthShift } from "../get-gantt-cell-month-shift";
import { getGanttCellYearShift } from "../get-gantt-cell-year-shift";
import { getGanttColumnWidth } from "../get-gantt-column-width";
import { getGanttStartCellByMonth } from "../get-gantt-start-cell-by-month";

type UseGanttTodayOptions = {
  ganttToday: ComputedRef<boolean>;
  ganttTodayInteractive: ComputedRef<boolean>;
  graphToday: ModelRef<string, string, string, string>;
  todayBodyElement: ComputedRef<HTMLDivElement | null | undefined>;
  todayHeaderElement: ComputedRef<HTMLDivElement | null | undefined>;
  graphElement: Readonly<ShallowRef<HTMLDivElement | null>>;
  graphBodyElement: Readonly<ShallowRef<HTMLDivElement | null>>;
  ganttView: ComputedRef<GanttViewType>;
  headerInfoItems: ComputedRef<GanttHeaderInfo[]>;
  updateGraphScroll: (px: number) => void;
  getGraphScroll: () => number | undefined;
};

export function useGanttToday(opts: UseGanttTodayOptions) {
  const dragging = ref(false);
  const initialLeft = computed(() => {
    if (!opts.ganttToday) return 0;

    const todayDate = new Date(opts.graphToday.value);
    const columnWidth = getGanttColumnWidth(opts.ganttView.value);
    let startCellLeft = 0;
    let startCell = 0;

    if (opts.ganttView.value === "years") {
      startCellLeft = getGanttCellYearShift(columnWidth, todayDate, "start");
      startCell = todayDate.getFullYear() - opts.headerInfoItems.value[0]?.year;
    } else if (opts.ganttView.value === "quarters" || opts.ganttView.value === "months") {
      startCellLeft = getGanttCellMonthShift(columnWidth, todayDate, "start");
      startCell = getGanttStartCellByMonth(todayDate, opts.headerInfoItems.value);
    } else if (opts.ganttView.value === "weeks") {
      startCellLeft = getGanttCellMonthShift(columnWidth * 4, todayDate, "start");
      startCell = getGanttStartCellByMonth(todayDate, opts.headerInfoItems.value);
      startCell *= 4;
    }

    return startCell * columnWidth + startCellLeft;
  });
  const dragDate = ref<string | null>(null);
  const dragLeft = ref(0);
  const left = computed(() => Math.max(MIN_GANTT_TODAY_LEFT, dragLeft.value || initialLeft.value));

  function onDragStart(event: TouchEvent | MouseEvent) {
    if (dragging.value) return;

    const eventController = new AbortController();
    dragging.value = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    let { clientX: cachedClientX } = extractDragPosition(event);
    let scrollTimer: NodeJS.Timeout | null = null;

    function startScroll(direction: "left" | "right") {
      if (scrollTimer == undefined) {
        const scrollTimerLocal = setInterval(() => {
          opts.updateGraphScroll(direction === "left" ? -20 : 20);
          updatePosition();

          if (eventController.signal.aborted) {
            clearInterval(scrollTimerLocal);
          }
        }, 25);
        scrollTimer = scrollTimerLocal;
      }
    }
    function stopScroll() {
      if (scrollTimer) {
        clearInterval(scrollTimer);
        scrollTimer = null;
      }
    }

    function getLeftFromPointer(event?: MouseEvent | TouchEvent) {
      const rect = opts.graphElement.value?.getBoundingClientRect();
      if (!rect) return MIN_GANTT_TODAY_LEFT;

      const minWidth = Math.min(rect.width, opts.graphBodyElement?.value?.clientWidth ?? 0);
      const maxX = rect.left + minWidth - MIN_GANTT_TODAY_LEFT;
      const minX = rect.left + MIN_GANTT_TODAY_LEFT;
      let x = cachedClientX;
      if (event) {
        const { clientX } = extractDragPosition(event);
        cachedClientX = clientX;
        x = clientX;
      }
      if (x > maxX) {
        x = maxX;
        startScroll("right");
      } else if (x < minX) {
        x = minX;
        startScroll("left");
      } else {
        stopScroll();
      }

      return x + (opts.getGraphScroll() ?? 0) - rect.left;
    }
    function getDateFromLeft(left: number) {
      const columnWidth = getGanttColumnWidth(opts.ganttView.value);
      const lastCellIndex = Math.floor(left / columnWidth);
      const lastCellLeft = left - lastCellIndex * columnWidth;

      if (opts.ganttView.value === "years") {
        const year = opts.headerInfoItems.value[lastCellIndex].year;
        const day = Math.ceil((lastCellLeft * getDaysInYear(year)) / columnWidth) || 1;
        const newDate = new Date(year, 0, day);

        return newDate.toISOString();
      } else if (opts.ganttView.value === "months" || opts.ganttView.value === "quarters") {
        let year = 0;
        let month = 0;

        let cursorYear = 0;
        let cursorMonth = 0;
        for (let i = 0; i <= lastCellIndex; i++) {
          const info = opts.headerInfoItems.value[cursorYear];
          if (i === lastCellIndex) {
            year = info.year;
            month = info.months[cursorMonth];

            continue;
          }

          if (info.months.length - 1 === cursorMonth) {
            cursorMonth = 0;
            cursorYear++;
            continue;
          }

          cursorMonth++;
        }
        const day = Math.ceil((lastCellLeft * getDaysInMonth(year, month)) / columnWidth) || 1;
        const newDate = new Date(year, month, day);

        return newDate.toISOString();
      } else if (opts.ganttView.value === "weeks") {
        let year = 0;
        let month = 0;
        const lastMonthCellIndex = Math.floor(lastCellIndex / 4);
        const lastWeekCellIndex = lastCellIndex - lastMonthCellIndex * 4;
        const lastMonthLeft = lastCellLeft + lastWeekCellIndex * columnWidth;

        let cursorYear = 0;
        let cursorMonth = 0;
        for (let i = 0; i <= lastMonthCellIndex; i++) {
          const info = opts.headerInfoItems.value[cursorYear];
          if (i === lastMonthCellIndex) {
            year = info.year;
            month = info.months[cursorMonth];

            continue;
          }

          if (info.months.length - 1 === cursorMonth) {
            cursorMonth = 0;
            cursorYear++;
            continue;
          }

          cursorMonth++;
        }
        const day =
          Math.ceil((lastMonthLeft * getDaysInMonth(year, month)) / (columnWidth * 4)) || 1;
        const newDate = new Date(year, month, day);

        return newDate.toISOString();
      }

      return opts.graphToday.value;
    }

    function onDragEnd(event: MouseEvent | TouchEvent) {
      if (scrollTimer != undefined) {
        clearInterval(scrollTimer);
      }

      eventController.abort();
      dragging.value = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const left = getLeftFromPointer(event);
      const date = getDateFromLeft(left);
      opts.graphToday.value = dateFormat(date, "YYYY-MM-DD");
      dragLeft.value = 0;
      dragDate.value = null;
    }
    function onDragMove(event: MouseEvent | TouchEvent) {
      if (!dragging.value) return;
      /** Prevent Scroll on Touch */
      if (event instanceof TouchEvent) {
        event.preventDefault();
      }

      const left = getLeftFromPointer(event);
      const date = getDateFromLeft(left);
      dragLeft.value = left;
      dragDate.value = date;
    }
    function updatePosition() {
      const left = getLeftFromPointer();
      const date = getDateFromLeft(left);
      dragLeft.value = left;
      dragDate.value = date;
    }

    document.addEventListener("wheel", updatePosition, {
      passive: true,
      signal: eventController.signal,
    });
    if (event instanceof TouchEvent) {
      document.addEventListener("touchmove", onDragMove, {
        passive: false,
        signal: eventController.signal,
      });
      document.addEventListener("touchend", onDragEnd, {
        signal: eventController.signal,
        passive: false,
      });
    } else {
      document.addEventListener("mousemove", onDragMove, {
        passive: false,
        signal: eventController.signal,
      });
      document.addEventListener("mouseup", onDragEnd, {
        signal: eventController.signal,
        passive: false,
      });
    }
  }

  /** drag init */
  watch(
    () => opts.todayBodyElement.value,
    (element, _, clean) => {
      if (!element) return;

      element.addEventListener("mousedown", onDragStart);
      element.addEventListener("touchstart", onDragStart, { passive: false });

      clean(() => {
        element.removeEventListener("mousedown", onDragStart);
        element.removeEventListener("touchstart", onDragStart);
      });
    },
  );
  watch(
    () => opts.todayHeaderElement.value,
    (element, _, clean) => {
      if (!element) return;

      element.addEventListener("mousedown", onDragStart);
      element.addEventListener("touchstart", onDragStart, { passive: false });

      clean(() => {
        element.removeEventListener("mousedown", onDragStart);
        element.removeEventListener("touchstart", onDragStart);
      });
    },
  );

  return { left, dragDate, dragging };
}
