import React from "react";
import {
  GANTT_BODY_ID,
  GANTT_COMMON_TABLE_BODY_ID,
  GANTT_COMMON_TABLE_HEADER_ID,
  GANTT_HEADER_ID,
} from "../table.constants";

const MAX_SCROLL_WIDTH = 10;

type Entities = {
  mainBody: HTMLElement;
  otherBody: HTMLElement;
  mainContainer: HTMLElement;
  otherContainer: HTMLElement;
  thumb: HTMLElement;
  scroll: HTMLElement;
};

function updateScroll(entities: Entities) {
  const scrollPercent =
    entities.mainContainer.scrollLeft /
    (entities.mainBody.scrollWidth - entities.mainContainer.clientWidth);
  const trackWidth = entities.scroll.clientWidth - entities.thumb.clientWidth;

  entities.thumb.style.left = `${scrollPercent * trackWidth}px`;
}

function onWheelTableGetter(entities: Entities) {
  return function onWheelTable(event: WheelEvent) {
    if (
      !entities.mainBody ||
      !entities.mainContainer ||
      !entities.scroll ||
      !entities.thumb ||
      !entities.otherContainer ||
      !entities.otherBody
    )
      return;
    if (!event.shiftKey) return;
    event.preventDefault();

    entities.mainContainer.scrollLeft += event.deltaY;
    entities.otherContainer.scrollLeft += event.deltaY;
    updateScroll(entities);
  };
}

function onObserveGetter(entities: Entities, setScroll: (scroll: boolean) => void) {
  return function onObserve() {
    if (
      !entities.mainBody ||
      !entities.mainContainer ||
      !entities.scroll ||
      !entities.thumb ||
      !entities.otherContainer
    )
      return;

    const contentWidth = entities.mainBody.scrollWidth;
    const visibleWidth = entities.mainContainer.clientWidth;

    if (contentWidth - visibleWidth <= MAX_SCROLL_WIDTH) {
      setScroll(false);
      entities.thumb.style.display = "none";

      return;
    }

    const ratio = visibleWidth / contentWidth;

    entities.thumb.style.display = "flex";
    entities.thumb.style.width = `${ratio * 100}%`;
    updateScroll(entities);

    setScroll(true);
  };
}

function onMouseDownGetter(entities: Entities) {
  let isDragging = false;

  return function onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (!entities.thumb) return;

    isDragging = true;
    const startX = event.clientX;
    const startLeft = parseInt(entities.thumb.style.left ?? 0, 10);

    function moveHandler(event: MouseEvent) {
      if (
        !entities.mainBody ||
        !entities.mainContainer ||
        !entities.scroll ||
        !entities.thumb ||
        !entities.otherContainer ||
        !entities.otherBody
      )
        return;
      if (!isDragging) return;

      const trackWidth = entities.scroll.clientWidth;
      const thumbWidth = entities.thumb.clientWidth;
      const maxLeft = trackWidth - thumbWidth;

      let newLeft = startLeft + event.clientX - startX;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));

      entities.thumb.style.left = `${newLeft}px`;

      const scrollPercent = newLeft / maxLeft;
      const contentScroll =
        (entities.mainBody.scrollWidth - entities.mainContainer.clientWidth) * scrollPercent;
      entities.mainContainer.scrollLeft = contentScroll;
      entities.otherContainer.scrollLeft = contentScroll;
    }

    const eventController = new AbortController();

    function upHandler() {
      isDragging = false;
      eventController.abort();
    }

    document.addEventListener("mousemove", moveHandler, { signal: eventController.signal });
    document.addEventListener("mouseup", upHandler, { signal: eventController.signal });
  };
}

export function useScroll() {
  const [tableScroll, setTableScroll] = React.useState(false);
  const [tableGanttScroll, setTableGanttScroll] = React.useState(false);

  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const tableScrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableGanttRef = React.useRef<HTMLTableElement | null>(null);
  const tableGanttScrollRef = React.useRef<HTMLDivElement | null>(null);

  /** GANTT SCROLL OBSERVER */
  React.useLayoutEffect(() => {
    const otherContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_HEADER_ID}`,
    );
    const mainContainer = tableGanttRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_BODY_ID}`,
    );
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const otherBody = otherContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableGanttScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;

    const onObserve = onObserveGetter(
      { mainBody, mainContainer, otherBody, otherContainer, scroll, thumb },
      setTableGanttScroll,
    );

    const observer = new ResizeObserver(onObserve);
    observer.observe(mainContainer);

    return () => {
      observer.disconnect();
    };
  }, []);
  /** GANTT SCROLL HANDLERS */
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

    const onWheelTable = onWheelTableGetter({
      mainBody,
      mainContainer,
      otherBody,
      otherContainer,
      scroll,
      thumb,
    });

    const onMouseDown = onMouseDownGetter({
      mainBody,
      mainContainer,
      otherBody,
      otherContainer,
      scroll,
      thumb,
    });

    thumb.addEventListener("mousedown", onMouseDown);
    mainBody.addEventListener("wheel", onWheelTable);
    otherBody.addEventListener("wheel", onWheelTable);

    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
      mainBody.removeEventListener("wheel", onWheelTable);
      otherBody.removeEventListener("wheel", onWheelTable);
    };
  }, [tableGanttScroll]);

  /** TABLE SCROLL OBSERVER*/
  React.useLayoutEffect(() => {
    const otherContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_HEADER_ID}`,
    );
    const mainContainer = tableRef.current?.querySelector?.<HTMLDivElement>(
      `#${GANTT_COMMON_TABLE_BODY_ID}`,
    );
    const mainBody = mainContainer?.firstChild as HTMLDivElement | undefined;
    const otherBody = otherContainer?.firstChild as HTMLDivElement | undefined;
    const scroll = tableScrollRef.current;
    const thumb = scroll?.firstChild?.firstChild as HTMLDivElement | undefined;
    if (!mainBody || !mainContainer || !scroll || !thumb || !otherContainer || !otherBody) return;

    const onObserve = onObserveGetter(
      { mainBody, mainContainer, otherBody, otherContainer, scroll, thumb },
      setTableScroll,
    );

    const observer = new ResizeObserver(onObserve);
    observer.observe(mainContainer);
    observer.observe(mainBody);

    return () => {
      observer.disconnect();
    };
  }, []);
  /** TABLE SCROLL HANDLERS*/
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

    const onWheelTable = onWheelTableGetter({
      mainBody,
      mainContainer,
      otherBody,
      otherContainer,
      scroll,
      thumb,
    });

    const onMouseDown = onMouseDownGetter({
      mainBody,
      mainContainer,
      otherBody,
      otherContainer,
      scroll,
      thumb,
    });

    thumb.addEventListener("mousedown", onMouseDown);
    mainBody.addEventListener("wheel", onWheelTable);
    otherBody.addEventListener("wheel", onWheelTable);

    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
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
