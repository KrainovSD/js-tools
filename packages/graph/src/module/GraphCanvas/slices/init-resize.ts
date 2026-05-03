import type { GraphCanvas } from "../GraphCanvas";

export function initResize<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area) throw new Error("bad init data");

  let initialResizeCall = true;

  const abortController = this.eventAbortController;
  const observer = new ResizeObserver(() => {
    if (initialResizeCall) {
      initialResizeCall = false;

      return;
    }

    if (abortController.signal.aborted) {
      observer.disconnect();

      return;
    }

    this.updateSize();
    requestAnimationFrame(() => {
      this.updateSize();
    });
  });

  document.addEventListener("scroll", this.updateRect.bind(this), {
    capture: true,
    passive: true,
    signal: abortController.signal,
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        this.highlightController?.abort();
        this.highlightedNode = null;
        this.highlightedLink = null;
        this.highlightedNeighbors = null;
        this.highlightProgress = 0;
        this.highlightStart = null;
        this.highlightPositive = false;
        return;
      }
      this.updateSize();
      requestAnimationFrame(() => {
        this.updateSize();
      });
    },
    { signal: abortController.signal },
  );

  observer.observe(this.area);
}
