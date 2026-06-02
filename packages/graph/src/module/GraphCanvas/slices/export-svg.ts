import { cloneDeep } from "@krainovsd/js-helpers";
import { zoomIdentity } from "d3-zoom";
import type { GraphCanvas } from "../GraphCanvas";
import { computeGraphBounds } from "../lib";
import { SvgContextAdapter } from "../lib/utils/svg-context";
import { initDraw } from "./init-draw";

export function exportToSvgSlice<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>, filename: string = "graph.svg", fit: boolean = false) {
  this.tick();

  let svgWidth = this.width;
  let svgHeight = this.height;

  const svgParts: string[] = [];
  const adapter = new SvgContextAdapter(svgParts);

  const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as GraphCanvas<
    NodeData,
    LinkData
  >;
  clone.context = adapter as unknown as CanvasRenderingContext2D;
  clone.isSelecting = false;
  clone.listeners = {} as typeof this.listeners;
  clone.nodes = cloneDeep(this.nodes);
  clone.links = cloneDeep(this.links);
  clone.particles = cloneDeep(this.particles);

  if (fit) {
    const bounds = computeGraphBounds(clone.nodes);
    if (bounds) {
      const pad = 50;
      const graphWidth = bounds.maxX - bounds.minX;
      const graphHeight = bounds.maxY - bounds.minY;
      if (graphWidth > 0 && graphHeight > 0) {
        svgWidth = graphWidth + pad * 2;
        svgHeight = graphHeight + pad * 2;
        const graphCenterX = bounds.minX + graphWidth / 2;
        const graphCenterY = bounds.minY + graphHeight / 2;
        clone.areaTransform = zoomIdentity
          .translate(svgWidth / 2, svgHeight / 2)
          .translate(-graphCenterX, -graphCenterY);
        clone.width = svgWidth;
        clone.height = svgHeight;
      }
    }
  }

  const draw = initDraw.call<
    GraphCanvas<NodeData, LinkData>,
    Parameters<typeof initDraw>,
    ReturnType<typeof initDraw>
  >(clone);
  draw();
  adapter.closeTransform();

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">`,
    ...svgParts,
    "</svg>",
  ].join("\n");

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
