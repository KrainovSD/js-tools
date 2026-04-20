import type { GraphCanvas } from "../GraphCanvas";
import type { LinkInterface, NodeInterface, NodeOptionsInterface } from "../types";

export function initSelection<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area) throw new Error("bad init data");

  this.isSelecting = false;
  this.selectionRect = null;
  let selectedNodesSet = new Set<NodeInterface<NodeData>>();
  let selectedLinksSet = new Set<LinkInterface<NodeData, LinkData>>();
  let localSelection = false;

  function onMouseDown(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent) {
    if (event.button !== 0 || !event.shiftKey) return;
    if (!this.area) return;
    event.stopPropagation();
    event.preventDefault();

    const [startX, startY] = this.getPointerAreaPosition(event);
    this.isSelecting = true;
    localSelection = true;
    this.selectionRect = { x1: startX, y1: startY, x2: startX, y2: startY };
    selectedNodesSet = new Set<NodeInterface<NodeData>>();
    selectedLinksSet = new Set<LinkInterface<NodeData, LinkData>>();
    const controller = new AbortController();
    this.area.addEventListener("mousemove", onMouseMove.bind(this), {
      signal: controller.signal,
    });
    this.area.addEventListener(
      "mouseup",
      () => {
        onMouseUp.call(this, controller);
      },
      {
        signal: controller.signal,
      },
    );
    window.addEventListener(
      "keyup",
      (event) => {
        if (event.key === "Shift") {
          onMouseUp.call(this, controller);
        }
      },
      { signal: controller.signal },
    );
  }

  function onMouseMove(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent) {
    if (!this.isSelecting || !this.selectionRect) return;
    event.stopPropagation();
    const [x, y] = this.getPointerAreaPosition(event);
    this.selectionRect.x2 = x;
    this.selectionRect.y2 = y;
    const rect = normalizeRect(this.selectionRect);
    const newNodes = new Set<NodeInterface<NodeData>>();
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (node.x == undefined || node.y == undefined) continue;
      if (node.visible === false) continue;
      const cache = this.nodeOptionsCache[i];
      if (isNodeInRect(node, rect, cache)) {
        newNodes.add(node);
      }
    }
    const newLinks = new Set<LinkInterface<NodeData, LinkData>>();
    for (const link of this.links) {
      const source = link.source as NodeInterface<NodeData>;
      const target = link.target as NodeInterface<NodeData>;
      if (newNodes.has(source) && newNodes.has(target)) {
        newLinks.add(link);
      }
    }
    for (const node of selectedNodesSet) {
      if (!newNodes.has(node)) {
        node._selected = false;
        this.listeners.onSelectionOut?.call(this, node, undefined);
      }
    }
    for (const link of selectedLinksSet) {
      if (!newLinks.has(link)) {
        link._selected = false;
        this.listeners.onSelectionOut?.call(this, undefined, link);
      }
    }
    for (const node of newNodes) {
      if (!selectedNodesSet.has(node)) {
        node._selected = true;
        this.listeners.onSelectionIn?.call(this, node, undefined);
      }
    }
    for (const link of newLinks) {
      if (!selectedLinksSet.has(link)) {
        link._selected = true;
        this.listeners.onSelectionIn?.call(this, undefined, link);
      }
    }
    selectedNodesSet = newNodes;
    selectedLinksSet = newLinks;
    this.draw();
  }

  function onMouseUp(this: GraphCanvas<NodeData, LinkData>, controller: AbortController) {
    controller.abort();
    if (!this.isSelecting) return;
    const nodes = Array.from(selectedNodesSet);
    const links = Array.from(selectedLinksSet);
    for (const node of nodes) {
      node._selected = false;
    }
    for (const link of links) {
      link._selected = false;
    }
    this.isSelecting = false;
    this.selectionRect = null;
    selectedNodesSet = new Set<NodeInterface<NodeData>>();
    selectedLinksSet = new Set<LinkInterface<NodeData, LinkData>>();
    this.listeners.onSelectionEnd?.call(this, nodes, links);
    this.tick();
  }

  function onSelectionEnd(event: MouseEvent) {
    if (localSelection) {
      event.stopImmediatePropagation();
      localSelection = false;
    }
  }

  this.area.addEventListener("mousedown", onMouseDown.bind(this), {
    signal: this.eventAbortController.signal,
  });
  this.area.addEventListener("click", onSelectionEnd, { signal: this.eventAbortController.signal });
}

function normalizeRect(rect: { x1: number; y1: number; x2: number; y2: number }): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const x = Math.min(rect.x1, rect.x2);
  const y = Math.min(rect.y1, rect.y2);
  const width = Math.abs(rect.x2 - rect.x1);
  const height = Math.abs(rect.y2 - rect.y1);
  return { x, y, width, height };
}

function isNodeInRect<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(
  node: NodeInterface<NodeData>,
  rect: { x: number; y: number; width: number; height: number },
  cache: Required<NodeOptionsInterface<NodeData, LinkData>> | undefined,
): boolean {
  const nx = node.x;
  const ny = node.y;
  if (nx == undefined || ny == undefined) return false;
  if (cache?.shape === "circle") {
    const r = cache.radius ?? 0;
    const closestX = Math.max(rect.x, Math.min(nx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(ny, rect.y + rect.height));
    const dx = nx - closestX;
    const dy = ny - closestY;
    return dx * dx + dy * dy <= r * r;
  }
  const hw = (cache?.width ?? 0) / 2;
  const hh = (cache?.height ?? 0) / 2;
  return (
    nx - hw >= rect.x &&
    nx + hw <= rect.x + rect.width &&
    ny - hh >= rect.y &&
    ny + hh <= rect.y + rect.height
  );
}
