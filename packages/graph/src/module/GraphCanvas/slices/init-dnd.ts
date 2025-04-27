import { isBoolean } from "@krainovsd/js-helpers";
import { greatest } from "d3-array";
import { drag as d3Drag } from "d3-drag";
import { select as d3Select } from "d3-selection";
import type { GraphCanvas } from "../GraphCanvas";
import { pointerGetter } from "../lib";
import type { DragEventInterface } from "../types";

export function initDnd<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area || !this.nodes) throw new Error("bad init data");

  const dragHandler = d3Drag<HTMLCanvasElement, unknown>()
    .subject((event: DragEventInterface<NodeData>) => {
      if (this.listeners.onDragSubject) {
        return this.listeners.onDragSubject(event, this.state);
      }

      if (!this.areaRect) return;

      const mouseEvent = event.sourceEvent as MouseEvent | TouchEvent;
      const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);

      return greatest(this.nodes, (node) => {
        if (!node.x || !node.y || (isBoolean(node.drag) && !node.drag)) return undefined;

        return this.graphSettings.dragPlaceCoefficient(node, pointerX, pointerY);
      });
    })
    .on("start", (event: DragEventInterface<NodeData>) => {
      this.listeners.onStartDragFinished?.(event, this.state);
    })
    .on("drag", (event: DragEventInterface<NodeData>) => {
      if (!this.isDragging) {
        this.isDragging = true;
        if (this.simulation) this.simulation.alphaTarget(0.3).restart();
      }

      if (!this.areaRect) return;
      const mouseEvent = event.sourceEvent as MouseEvent | TouchEvent;
      const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);
      event.subject.fx = pointerX;
      event.subject.fy = pointerY;

      this.listeners.onMoveDragFinished?.(event, this.state);
    })
    .on("end", (event: DragEventInterface<NodeData>) => {
      this.isDragging = false;

      if (!event.active && this.simulation) this.simulation.alphaTarget(0);

      const sourceEvent = event.sourceEvent as MouseEvent | TouchEvent;
      if (sourceEvent.altKey && this.areaRect) {
        const [pointerX, pointerY] = pointerGetter(sourceEvent, this.areaRect, this.areaTransform);
        event.subject.fx = pointerX;
        event.subject.fy = pointerY;
      } else {
        event.subject.fx = null;
        event.subject.fy = null;
      }

      this.listeners.onEndDragFinished?.(event, this.state);
    });

  d3Select(this.area).call(dragHandler);
}
