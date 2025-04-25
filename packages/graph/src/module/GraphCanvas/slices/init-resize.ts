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

    requestAnimationFrame(() => {
      this.updateSize();
    });
  });

  document.addEventListener("scroll", this.updateRect.bind(this), {
    capture: true,
    passive: true,
    signal: abortController.signal,
  });

  observer.observe(this.area);
}
