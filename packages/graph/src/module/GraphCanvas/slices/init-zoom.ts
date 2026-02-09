import { isArray } from "@krainovsd/js-helpers";
import { select as d3Select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import type { GraphCanvas } from "../GraphCanvas";
import type { ZoomEventInterface } from "../types";
import { updateLinkCache } from "./update-link-cache";
import { updateNodeCache } from "./update-node-cache";

export function initZoom<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>, currentZoom?: ZoomTransform) {
  if (!this.area) throw new Error("bad init data");

  const zoomInstance = zoom<HTMLCanvasElement, unknown>()
    .scaleExtent(this.graphSettings.zoomExtent)
    .on("zoom", (event: ZoomEventInterface) => {
      this.listeners.onZoom?.call?.(this, event);
      const oldTransform = this.areaTransform;
      this.areaTransform = event.transform;
      if (this.areaTransform.k !== oldTransform.k) {
        updateLinkCache.call<
          GraphCanvas<NodeData, LinkData>,
          Parameters<typeof updateLinkCache>,
          ReturnType<typeof updateLinkCache>
        >(this);
        updateNodeCache.call<
          GraphCanvas<NodeData, LinkData>,
          Parameters<typeof updateNodeCache>,
          ReturnType<typeof updateNodeCache>
        >(this, true);
      }

      if (!this.simulationWorking && !this.highlightWorking)
        requestAnimationFrame(() => this.draw());
    });

  if (this.graphSettings.translateExtentEnable) {
    const coefficient = this.graphSettings.translateExtentCoefficient;
    const [coefficientX, coefficientY] = isArray(coefficient)
      ? coefficient
      : [coefficient, coefficient];

    const [
      [minX = -this.width * coefficientX, minY = -this.height * coefficientY],
      [maxX = this.width * coefficientX, maxY = this.height * coefficientY],
    ] = this.graphSettings.translateExtent;

    zoomInstance.translateExtent([
      [minX, minY],
      [maxX, maxY],
    ]);
  }

  d3Select(this.area).call(zoomInstance).on("dblclick.zoom", null);

  const zoomInitial = currentZoom ?? this.graphSettings.zoomInitial;
  this.areaTransform = new ZoomTransform(
    zoomInitial?.k ?? 1,
    zoomInitial?.x ?? this.width / 2,
    zoomInitial?.y ?? this.height / 2,
  );
  zoom<HTMLCanvasElement, unknown>().transform(d3Select(this.area), this.areaTransform);
}
