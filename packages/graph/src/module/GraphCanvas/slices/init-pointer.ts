import { isObject } from "lodash";
import { checkType } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import { linkByPointerGetter, nodeByPointerGetter } from "../lib";
import type { LinkInterface, NodeInterface } from "../types";

export function initPointer<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area || !this.nodes) throw new Error("bad init data");

  function onHover(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (!this.area) return;

    let currentNode: NodeInterface<NodeData> | undefined;
    let currentLink: LinkInterface<NodeData, LinkData> | undefined;
    const checkHighlightNode = this.highlightSettings.highlightByHoverNode && !this.isDragging;
    const checkHighlightLink = this.highlightSettings.highlightByHoverLink && !this.isDragging;
    let highlightNode = true;
    let highlightLink = true;

    if (checkHighlightNode) {
      currentNode = nodeByPointerGetter({
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });
      if (currentNode?.highlight != undefined) highlightNode = currentNode.highlight;
    }
    if (currentNode && highlightNode) {
      this.area.style.cursor = "pointer";
    } else if (checkHighlightLink) {
      currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });
      if (currentLink?.highlight != undefined) highlightLink = currentLink?.highlight;

      if (currentLink && highlightLink) {
        this.area.style.cursor = "pointer";
      } else {
        this.area.style.cursor = "default";
      }
    } else {
      this.area.style.cursor = "default";
    }
    if (currentNode && highlightNode && this.highlightedNode !== currentNode) {
      this.highlightedNode = currentNode;
      this.highlightedLink = null;
      this.highlightedNeighbors = new Set(this.highlightedNode?.neighbors ?? []);
      this.highlightWorking = true;

      if (!this.simulationWorking && !this.highlightDrawing)
        requestAnimationFrame(() => {
          this.draw();
        });
    } else if (
      currentLink &&
      highlightLink &&
      checkType<NodeInterface<NodeData>>(currentLink.source, isObject(currentLink.source)) &&
      checkType<NodeInterface<NodeData>>(currentLink.target, isObject(currentLink.target)) &&
      this.highlightedLink !== currentLink
    ) {
      this.highlightProgress = 0;
      this.highlightedLink = currentLink;
      this.highlightedNode = null;
      this.highlightedNeighbors = new Set([currentLink.source.id, currentLink.target.id]);
      this.highlightWorking = true;

      if (!this.simulationWorking && !this.highlightDrawing)
        requestAnimationFrame(() => {
          this.draw();
        });
    } else if (!currentNode && !currentLink && (this.highlightedNode || this.highlightedLink)) {
      this.highlightWorking = false;
      if (!this.simulationWorking && !this.highlightDrawing)
        requestAnimationFrame(() => {
          this.draw();
        });
    }

    if (!this.listeners.onMove) return;

    if (!currentNode && !checkHighlightNode)
      currentNode = nodeByPointerGetter({
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });
    if (!currentNode && (!checkHighlightNode || (!checkHighlightLink && !currentLink))) {
      currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });
    }

    if (!currentNode) return void this.listeners.onMove(event, currentNode, currentLink);
  }
  function onWheelClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (
      this.isDragging ||
      !this.listeners.onWheelClick ||
      !("button" in event) ||
      event.button !== 1
    )
      return;

    const currentNode = nodeByPointerGetter({
      areaRect: this.areaRect,
      areaTransform: this.areaTransform,
      mouseEvent: event,
      nodes: this.nodes,
    });

    if (!currentNode) {
      const currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });

      return void this.listeners.onWheelClick(event, undefined, currentLink);
    }

    return void this.listeners.onWheelClick(event, currentNode, undefined);
  }
  function onRightClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent) {
    if (!this.listeners.onContextMenu) return;

    const currentNode = nodeByPointerGetter({
      areaRect: this.areaRect,
      areaTransform: this.areaTransform,
      mouseEvent: event,
      nodes: this.nodes,
    });

    if (!currentNode) {
      const currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });

      return void this.listeners.onContextMenu(event, undefined, currentLink);
    }

    return void this.listeners.onContextMenu(event, currentNode, undefined);
  }
  function onDoubleClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (!this.listeners.onDoubleClick) return;

    const currentNode = nodeByPointerGetter({
      areaRect: this.areaRect,
      areaTransform: this.areaTransform,
      mouseEvent: event,
      nodes: this.nodes,
    });
    if (!currentNode) {
      const currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });

      return void this.listeners.onDoubleClick(event, undefined, currentLink);
    }

    return void this.listeners.onDoubleClick(event, currentNode, undefined);
  }
  function onClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (this.isDragging || !this.listeners.onClick || ("button" in event && event.button !== 0))
      return;
    const currentNode = nodeByPointerGetter({
      areaRect: this.areaRect,
      areaTransform: this.areaTransform,
      mouseEvent: event,
      nodes: this.nodes,
    });
    if (!currentNode) {
      const currentLink = linkByPointerGetter({
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        links: this.links,
      });

      return void this.listeners.onClick(event, undefined, currentLink);
    }

    return void this.listeners.onClick(event, currentNode, undefined);
  }

  /** hover */
  this.area.addEventListener("mousemove", onHover.bind(this), {
    signal: this.eventAbortController.signal,
  });
  this.area.addEventListener("touchmove", onHover.bind(this), {
    signal: this.eventAbortController.signal,
  });

  /** dblclick */
  this.area.addEventListener("dblclick", onDoubleClick.bind(this), {
    signal: this.eventAbortController.signal,
  });

  /** wheel click */
  this.area.addEventListener("mousedown", onWheelClick.bind(this), {
    signal: this.eventAbortController.signal,
  });

  /** click */
  this.area.addEventListener("click", onClick.bind(this), {
    signal: this.eventAbortController.signal,
  });

  /** right click */
  this.area.addEventListener("contextmenu", onRightClick.bind(this), {
    signal: this.eventAbortController.signal,
  });
}
