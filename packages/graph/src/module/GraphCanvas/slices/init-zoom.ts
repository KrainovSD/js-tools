import { isArray } from "@krainovsd/js-helpers";
import { select as d3Select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import type { GraphCanvas } from "../GraphCanvas";
import { computeGraphBounds } from "../lib";
import type { ZoomEventInterface } from "../types";
import { updateLinkCache } from "./update-link-cache";
import { updateNodeCache } from "./update-node-cache";

const DEFAULT_ZOOM_EXTENT: [number, number] = [0.3, 10];
const DEFAULT_TRANSLATE_EXTENT_COEFFICIENT = 8;
const DEFAULT_MARGIN = 0.25;

export function initZoom<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>, currentZoom?: ZoomTransform) {
  if (!this.area) throw new Error("bad init data");

  const bounds = computeGraphBounds(this.nodes);
  const zoomExtent = resolveZoomExtent(
    this.graphSettings.zoomExtent,
    this.width,
    this.height,
    this.graphSettings.zoomExtentMargin ?? DEFAULT_MARGIN,
    bounds,
  );
  const translateExtent = resolveTranslateExtent(
    this.graphSettings.translateExtent,
    this.graphSettings.translateExtentCoefficient,
    this.graphSettings.translateExtentOverlap,
    this.width,
    this.height,
    zoomExtent,
    bounds,
  );
  this._translateExtent = translateExtent;

  const zoomInstance = zoom<HTMLCanvasElement, unknown>()
    .scaleExtent(zoomExtent)
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
        >(this);
      }

      if (!this.simulationWorking && !this.highlightWorking)
        requestAnimationFrame(() => this.draw());
    });

  zoomInstance.translateExtent(translateExtent);
  d3Select(this.area).call(zoomInstance).on("dblclick.zoom", null);

  const zoomInitial = currentZoom ?? this.graphSettings.zoomInitial;
  this.areaTransform = new ZoomTransform(
    Math.max(zoomInitial?.k ?? 1, zoomExtent[0]),
    zoomInitial?.x ?? this.width / 2,
    zoomInitial?.y ?? this.height / 2,
  );
  zoom<HTMLCanvasElement, unknown>().transform(d3Select(this.area), this.areaTransform);
}

function resolveZoomExtent(
  userExtent: [number, number] | null,
  viewWidth: number,
  viewHeight: number,
  margin: number,
  bounds: ReturnType<typeof computeGraphBounds>,
): [number, number] {
  if (
    userExtent &&
    userExtent.length === 2 &&
    userExtent[0] != undefined &&
    userExtent[1] != undefined
  ) {
    return userExtent;
  }
  if (!bounds) return DEFAULT_ZOOM_EXTENT;
  const graphWidth = bounds.maxX - bounds.minX;
  const graphHeight = bounds.maxY - bounds.minY;
  if (graphWidth === 0 || graphHeight === 0) return DEFAULT_ZOOM_EXTENT;
  const scaleToFit = (1 - margin) / Math.max(graphWidth / viewWidth, graphHeight / viewHeight);
  return [scaleToFit, DEFAULT_ZOOM_EXTENT[1]];
}

function resolveTranslateExtent(
  userExtent: [[number?, number?], [number?, number?]] | null,
  userCoefficient: number | [number, number] | null,
  overlap: number,
  viewWidth: number,
  viewHeight: number,
  zoomExtent: [number, number],
  bounds: ReturnType<typeof computeGraphBounds>,
): [[number, number], [number, number]] {
  if (userExtent && userExtent.length >= 2 && isArray(userExtent[0]) && isArray(userExtent[1])) {
    return [
      [
        userExtent[0][0] ?? -viewWidth * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
        userExtent[0][1] ?? -viewHeight * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
      ],
      [
        userExtent[1][0] ?? viewWidth * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
        userExtent[1][1] ?? viewHeight * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
      ],
    ];
  }
  if (userCoefficient) {
    const [cx, cy] = isArray(userCoefficient)
      ? userCoefficient
      : [userCoefficient, userCoefficient];
    return [
      [-viewWidth * cx, -viewHeight * cy],
      [viewWidth * cx, viewHeight * cy],
    ];
  }
  if (!bounds) {
    return [
      [
        -viewWidth * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
        -viewHeight * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
      ],
      [
        viewWidth * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
        viewHeight * DEFAULT_TRANSLATE_EXTENT_COEFFICIENT,
      ],
    ];
  }

  const minZoom = zoomExtent[0];
  const zoomViewWidth = viewWidth / minZoom;
  const zoomViewHeight = viewHeight / minZoom;
  const graphWidth = bounds.maxX - bounds.minX;
  const graphHeight = bounds.maxY - bounds.minY;

  const minX = bounds.minX + overlap * graphWidth - zoomViewWidth;
  const maxX = bounds.maxX - overlap * graphWidth + zoomViewWidth;
  const minY = bounds.minY + overlap * graphHeight - zoomViewHeight;
  const maxY = bounds.maxY - overlap * graphHeight + zoomViewHeight;

  return [
    [minX, minY],
    [maxX, maxY],
  ];
}
