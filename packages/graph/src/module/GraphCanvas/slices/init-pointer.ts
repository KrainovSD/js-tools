import type { GraphCanvas } from "../GraphCanvas";
import { linkByPointerGetter, nodeByPointerGetter } from "../lib";
import type { LinkInterface, NodeInterface } from "../types";

export function initPointer<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area || !this.nodes) throw new Error("bad init data");

  function onHover(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (!this.area || this.isSelecting) return;

    const [pointerX, pointerY] = this.getPointerAreaPosition(event);

    let currentNode: NodeInterface<NodeData> | undefined;
    let currentLink: LinkInterface<NodeData, LinkData> | undefined;
    const checkHighlightNode = this.highlightSettings.highlightByHoverNode && !this.isDragging;
    const checkHighlightLink = this.highlightSettings.highlightByHoverLink && !this.isDragging;
    let highlightNode = true;
    let highlightLink = true;

    if (checkHighlightNode) {
      currentNode = nodeByPointerGetter({
        pointerX,
        pointerY,
        nodes: this.nodes,
      });
      if (currentNode?.highlight != undefined) highlightNode = currentNode.highlight;
    }
    if (currentNode && highlightNode) {
      this.area.style.cursor = "pointer";
    } else if (checkHighlightLink) {
      currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
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
    this.animateHighlight(
      highlightNode ? currentNode : undefined,
      highlightLink ? currentLink : undefined,
    );

    if (!this.listeners.onHover) return;
    if (!currentNode && !checkHighlightNode) {
      currentNode = nodeByPointerGetter({
        pointerX,
        pointerY,
        nodes: this.nodes,
      });
    }
    if (!currentNode && (!checkHighlightNode || (!checkHighlightLink && !currentLink))) {
      currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
      });
    }
    this.listeners.onHover.call(this, event, currentNode, currentLink);
  }
  function onWheelClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (
      this.isDragging ||
      !this.listeners.onWheelClick ||
      !("button" in event) ||
      event.button !== 1
    )
      return;

    const [pointerX, pointerY] = this.getPointerAreaPosition(event);
    const currentNode = nodeByPointerGetter({
      pointerX,
      pointerY,
      nodes: this.nodes,
    });

    if (!currentNode) {
      const [pointerX, pointerY] = this.getPointerAreaPosition(event);
      const currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
      });

      return void this.listeners.onWheelClick.call(this, event, undefined, currentLink);
    }

    return void this.listeners.onWheelClick.call(this, event, currentNode, undefined);
  }
  function onRightClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent) {
    if (!this.listeners.onContextMenu) return;

    const [pointerX, pointerY] = this.getPointerAreaPosition(event);
    const currentNode = nodeByPointerGetter({
      pointerX,
      pointerY,
      nodes: this.nodes,
    });

    if (!currentNode) {
      const [pointerX, pointerY] = this.getPointerAreaPosition(event);
      const currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
      });

      return void this.listeners.onContextMenu.call(this, event, undefined, currentLink);
    }

    return void this.listeners.onContextMenu.call(this, event, currentNode, undefined);
  }
  function onDoubleClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (!this.listeners.onDoubleClick) return;

    const [pointerX, pointerY] = this.getPointerAreaPosition(event);
    const currentNode = nodeByPointerGetter({
      pointerX,
      pointerY,
      nodes: this.nodes,
    });
    if (!currentNode) {
      const [pointerX, pointerY] = this.getPointerAreaPosition(event);
      const currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
      });

      return void this.listeners.onDoubleClick.call(this, event, undefined, currentLink);
    }

    return void this.listeners.onDoubleClick.call(this, event, currentNode, undefined);
  }
  function onClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
    if (this.isDragging || !this.listeners.onClick || ("button" in event && event.button !== 0))
      return;
    const [pointerX, pointerY] = this.getPointerAreaPosition(event);
    const currentNode = nodeByPointerGetter({
      pointerX,
      pointerY,
      nodes: this.nodes,
    });
    if (!currentNode) {
      const [pointerX, pointerY] = this.getPointerAreaPosition(event);
      const currentLink = linkByPointerGetter({
        pointerX,
        pointerY,
        linkHoverExtraZone: this.highlightSettings.linkHoverExtraZone,
        links: this.links,
        curve: this.linkSettings.curve,
      });

      return void this.listeners.onClick.call(this, event, undefined, currentLink);
    }

    return void this.listeners.onClick.call(this, event, currentNode, undefined);
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
