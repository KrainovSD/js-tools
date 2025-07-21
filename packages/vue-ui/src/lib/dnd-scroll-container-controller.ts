export type DnDScrollContainerControllerOptions = {
  threshold?: number;
  step?: number;
  interval?: number;
};

export function createDndScrollContainerController(
  node: HTMLElement,
  { interval = 25, step = 20, threshold = 50 }: DnDScrollContainerControllerOptions = {},
) {
  const { top, bottom, left, right } = node.getBoundingClientRect();
  let scrollLeft = node.scrollLeft;
  let scrollTop = node.scrollTop;
  const clientWidth = node.clientWidth;
  const clientHeight = node.clientHeight;
  const scrollWidth = node.scrollWidth;
  const scrollHeight = node.scrollHeight;
  let scrollInterval: NodeJS.Timeout | undefined;

  function canScrollBottom() {
    return scrollTop + clientHeight < scrollHeight;
  }
  function canScrollTop() {
    return scrollTop > 0;
  }
  function canScrollRight() {
    return scrollLeft + clientWidth < scrollWidth;
  }
  function canScrollLeft() {
    return scrollLeft > 0;
  }

  function handleScrollLeft() {
    node.scrollLeft -= step;
    scrollLeft = node.scrollLeft;
  }
  function handleScrollRight() {
    node.scrollLeft += step;
    scrollLeft = node.scrollLeft;
  }
  function handleScrollTop() {
    node.scrollTop -= step;
    scrollTop = node.scrollTop;
  }
  function handleScrollBottom() {
    node.scrollTop += step;
    scrollTop = node.scrollTop;
  }

  function startScrollElement(x: number, y: number) {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }

    const isNearTop = y < top + threshold;
    const isNearBottom = y > bottom - threshold;
    const isNearLeft = x < left + threshold;
    const isNearRight = x > right - threshold;

    if (isNearLeft && canScrollLeft()) {
      handleScrollLeft();
    } else if (isNearRight && canScrollRight()) {
      handleScrollRight();
    }

    if (isNearTop && canScrollTop()) {
      handleScrollTop();
    } else if (isNearBottom && canScrollBottom()) {
      handleScrollBottom();
    }

    scrollInterval = setInterval(() => {
      startScrollElement(x, y);
    }, interval);
  }

  function stopScrollElement() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
  }

  return { startScrollElement, stopScrollElement };
}
