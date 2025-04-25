import { create as d3Create } from "d3-selection";
import type { GraphCanvas } from "../GraphCanvas";

export function initArea<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.area || !this.context || !this.container) {
    this.container = d3Create("div")
      .attr("style", "padding: 0 !important; width: 100%; height: 100%;")
      .node();
    if (!this.container) throw new Error("couldn't create container");
    this.root.appendChild(this.container);

    const { width, height } = this.root.getBoundingClientRect();
    this.width = width;
    this.height = height;

    this.area = d3Create("canvas")
      .attr("width", this.dpi * this.width)
      .attr("height", this.dpi * this.height)
      .attr("style", `width: 100%; height: 100%; border: none !important;`)
      .node();

    if (!this.area) throw new Error("couldn't create canvas");
    this.container.appendChild(this.area);
    this.areaRect = this.area.getBoundingClientRect();

    this.context = this.area.getContext("2d");
    if (!this.context) throw new Error("couldn't create canvas context");
    this.context.scale(this.dpi, this.dpi);
  }
}
