import React from "react";
import {
  GANTT_BODY_ID,
  GANTT_COMMON_TABLE_BODY_ID,
  GANTT_COMMON_TABLE_HEADER_ID,
  GANTT_HEADER_ID,
} from "../table.constants";

// eslint-disable-next-line max-params
function updateScroll(
  container: HTMLDivElement,
  table: HTMLDivElement,
  scroll: HTMLDivElement,
  thumb: HTMLElement,
) {
  const scrollPercent = container.scrollLeft / (table.scrollWidth - container.clientWidth);
  const trackWidth = scroll.clientWidth - thumb.clientWidth;

  thumb.style.left = `${scrollPercent * trackWidth}px`;
}

export function useScroll() {
  const [tableScroll, setTableScroll] = React.useState(false);
  const [tableGanttScroll, setTableGanttScroll] = React.useState(false);

  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const tableScrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableGanttRef = React.useRef<HTMLTableElement | null>(null);
  const tableGanttScrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const otherContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_HEADER_ID}`,
    );
    const mainContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_BODY_ID}`,
    );
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableGanttScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer) return;

    const observer = new ResizeObserver(() => {
      if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer) return;

      const contentWidth = mainBody.scrollWidth;
      const visibleWidth = mainContainer.clientWidth;

      if (contentWidth - visibleWidth <= 0) {
        setTableGanttScroll(false);

        return;
      }

      const ratio = visibleWidth / contentWidth;

      thumb.style.display = "flex";
      thumb.style.width = `${ratio * 100}%`;
      updateScroll(mainContainer, mainBody, scroll, thumb);

      setTableGanttScroll(true);
    });

    observer.observe(mainContainer);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!tableGanttScroll) return;

    const otherContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_HEADER_ID}`,
    );
    const otherBody = otherContainer?.firstChild as HTMLDivElement | undefined;
    const mainContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_BODY_ID}`,
    );
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableGanttScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;

    function onWheelTable(event: WheelEvent) {
      if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;
      if (!event.shiftKey) return;
      event.preventDefault();

      mainContainer.scrollLeft += event.deltaY;
      otherContainer.scrollLeft += event.deltaY;
      updateScroll(mainContainer, mainBody, scroll, thumb);
    }

    mainBody.addEventListener("wheel", onWheelTable);
    otherBody.addEventListener("wheel", onWheelTable);

    return () => {
      mainBody.removeEventListener("wheel", onWheelTable);
      otherBody.removeEventListener("wheel", onWheelTable);
    };
  }, [tableGanttScroll]);

  React.useLayoutEffect(() => {
    const otherContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_HEADER_ID}`,
    );
    const mainContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_BODY_ID}`,
    );
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer) return;

    const observer = new ResizeObserver(() => {
      if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer) return;

      const contentWidth = mainBody.scrollWidth;
      const visibleWidth = mainContainer.clientWidth;

      if (contentWidth - visibleWidth <= 0) {
        setTableScroll(false);

        return;
      }

      const ratio = visibleWidth / contentWidth;

      thumb.style.display = "flex";
      thumb.style.width = `${ratio * 100}%`;
      updateScroll(mainContainer, mainBody, scroll, thumb);

      setTableScroll(true);
    });

    observer.observe(mainContainer);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!tableScroll) return;

    const otherContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_HEADER_ID}`,
    );
    const mainContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_BODY_ID}`,
    );
    const otherBody = otherContainer?.firstChild as HTMLDivElement | undefined;
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;

    function onWheelTable(event: WheelEvent) {
      if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;
      if (!event.shiftKey) return;
      event.preventDefault();

      mainContainer.scrollLeft += event.deltaY;
      otherContainer.scrollLeft += event.deltaY;
      updateScroll(mainContainer, mainBody, scroll, thumb);
    }

    mainBody.addEventListener("wheel", onWheelTable);
    otherBody.addEventListener("wheel", onWheelTable);

    return () => {
      mainBody.removeEventListener("wheel", onWheelTable);
      otherBody.removeEventListener("wheel", onWheelTable);
    };
  }, [tableScroll]);

  return {
    tableRef,
    tableGanttRef,
    tableGanttScrollRef,
    tableScrollRef,
  };
}
