import React from "react";

const MIN_WIDTH = 10;

export function useSplitter(instantSizing: boolean = false) {
  const splitterRef = React.useRef<HTMLDivElement | null>(null);
  const splitterGhostRef = React.useRef<HTMLDivElement | null>(null);
  const splitterOverflowRef = React.useRef<HTMLDivElement | null>(null);

  const parentWidthRef = React.useRef(0);
  const sizesRef = React.useRef([10, 10]);
  const tempSizesRef = React.useRef([10, 10]);
  const [sizes, setSizes] = React.useState([10, 10]);
  const [isDragging, setIsDragging] = React.useState(false);

  const startDrag = React.useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    if (!instantSizing) {
      if (splitterGhostRef.current) {
        splitterGhostRef.current.style.visibility = "visible";
      }
    }
  }, [instantSizing]);

  const stopDrag = React.useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    if (!instantSizing) {
      setSizes(tempSizesRef.current);
      sizesRef.current = tempSizesRef.current;

      if (splitterGhostRef.current) {
        splitterGhostRef.current.style.visibility = "hidden";
        splitterGhostRef.current.style.left = "0px";
      }

      if (splitterOverflowRef.current) {
        const containerRect = getContainerRect();
        if (!containerRect) return;
        splitterOverflowRef.current.style.width = `${containerRect.width}px`;
        splitterOverflowRef.current.style.left = `-${containerRect.width - tempSizesRef.current[1]}px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instantSizing]);

  function getContainer() {
    if (!splitterRef.current) return;
    const parent = splitterRef.current.parentElement;

    return parent;
  }

  function getSplitterRect() {
    if (!splitterRef.current) return;

    return splitterRef.current.getBoundingClientRect();
  }

  function getContainerRect() {
    const container = getContainer();
    if (!container) return;

    return container.getBoundingClientRect();
  }

  function getSizes(event?: MouseEvent) {
    const containerRect = getContainerRect();
    if (!containerRect) return;
    const maxWidth = containerRect.width - MIN_WIDTH;
    const minWidth = MIN_WIDTH;
    let newSize: number;

    if (event) {
      newSize = event.clientX - containerRect.left;
    } else {
      newSize = containerRect.width / 2;
    }
    if (newSize < minWidth) newSize = minWidth;
    else if (newSize > maxWidth) newSize = maxWidth;

    return [newSize, containerRect.width - newSize];
  }

  const onDrag = React.useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;
      const sizes = getSizes(event);
      if (!sizes) return;

      if (!instantSizing) {
        const splitter = getSplitterRect();
        const container = getContainerRect();
        if (!splitterGhostRef.current || !splitter || !container) return;
        splitterGhostRef.current.style.left = `${sizes[0] - splitter.left + container.left}px`;
        tempSizesRef.current = sizes;
      } else {
        setSizes(sizes);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instantSizing, isDragging],
  );

  React.useLayoutEffect(() => {
    const container = getContainer();
    if (!container) return;

    const observer = new ResizeObserver((entities) => {
      const currentWidth = entities[0].target.clientWidth;
      if (currentWidth === parentWidthRef.current) return;

      parentWidthRef.current = currentWidth;
      const sizes = getSizes();
      if (!sizes) return;
      setSizes(sizes);
      if (!instantSizing) {
        const contentRect = entities[0].contentRect;
        sizesRef.current = sizes;
        tempSizesRef.current = sizes;
        if (splitterGhostRef.current) {
          splitterGhostRef.current.style.left = "0px";
        }
        if (splitterOverflowRef.current) {
          splitterOverflowRef.current.style.width = `${contentRect.width}px`;
          splitterOverflowRef.current.style.left = `-${contentRect.width - sizes[1]}px`;
        }
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);

    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [onDrag, stopDrag]);

  return { sizes, startDrag, splitterRef, splitterGhostRef, splitterOverflowRef, isDragging };
}
