/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from "d3";
import type { GraphInterface, LinkInterface, NodeInterface } from "./Graph.types";

const POSITION_X_CONSTANT = 0;
const POSITION_Y_CONSTANT = 0;

export class Graph<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  private nodes: NodeInterface<NodeData>[];

  private links: LinkInterface<NodeData, LinkData>[];

  private width: number;

  private height: number;

  private selector: string;

  private simulation:
    | d3.Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>
    | undefined;

  private area: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown> | undefined;

  private linksNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private nodesNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private color = d3.scaleOrdinal(d3.schemeCategory10);

  constructor({ height, links, nodes, width, selector }: GraphInterface<NodeData, LinkData>) {
    this.nodes = nodes;
    this.links = links;
    this.height = height;
    this.width = width;
    this.selector = selector;

    this.refreshSimulation();
  }

  changeGraph(options: Omit<Partial<GraphInterface<NodeData, LinkData>>, "selector">) {
    if (options.width != undefined) this.width = options.width;
    if (options.height != undefined) this.height = options.height;
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;

    this.refreshSimulation();
  }

  start() {
    this.refreshSimulation();
  }

  stop() {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = undefined;
    }
    if (this.linksNode) {
      this.linksNode.remove();
      this.linksNode = undefined;
    }
    if (this.nodesNode) {
      this.nodesNode.remove();
      this.nodesNode = undefined;
    }
  }

  private refreshSimulation() {
    if (!this.simulation) {
      this.simulation = d3.forceSimulation<
        NodeInterface<NodeData>,
        LinkInterface<NodeData, LinkData>
      >();

      // .force("collide", d3.forceCollide().radius(5).strength(1).iterations(2));
    }
    if (!this.area) {
      this.area = d3
        .select(this.selector)
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
        .attr("style", "max-width: 100%; height: auto;");
    }

    this.updateElements();

    if (this.simulation) {
      this.simulation
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody<NodeInterface<NodeData>>())
        .force("center", d3.forceCenter().strength(1))
        // .force("centers", d3.forceCenter(this.width / 2, this.height / 2))
        // .force("x", d3.forceX(this.width / 2))
        // .force("y", d3.forceY(this.height / 2))
        .restart();
    }
  }

  private updateElements() {
    if (!this.simulation) {
      throw new Error("simulation was not initialized yet");
    }
    if (!this.area) {
      throw new Error("area was not initialized yet");
    }

    this.simulation.nodes(this.nodes);
    this.simulation.force(
      "link",
      d3
        .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
        .id((d) => d.id)
        .distance(10)
        .strength(1),
    );

    if (!this.linksNode) {
      this.linksNode = this.area.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6);
    }
    const links = this.linksNode
      .selectAll("line")
      .data(this.links)
      .join(
        (enter) => enter.append("line").attr("stroke-width", 1.4),
        (update) => update,
        (exit) => exit.remove(),
      );

    if (!this.nodesNode) {
      this.nodesNode = this.area.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5);
    }
    const nodes = this.nodesNode
      .selectAll<d3.BaseType, NodeInterface<NodeData>>("circle")
      .data(this.nodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("r", 5)
            .attr("fill", (d) => this.color(String(d.group)))
            .call(
              d3
                .drag<Element, NodeInterface<NodeData>>()
                .on("start", (event: any) => {
                  if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();
                  event.subject.fx = event.subject.x;
                  event.subject.fy = event.subject.y;
                })
                .on("drag", (event: any) => {
                  event.subject.fx = event.x;
                  event.subject.fy = event.y;
                })
                .on("end", (event: any) => {
                  if (!event.active && this.simulation) this.simulation.alphaTarget(0);
                  event.subject.fx = null;
                  event.subject.fy = null;
                }) as unknown as (
                selection: d3.Selection<
                  SVGCircleElement,
                  NodeInterface<NodeData>,
                  SVGGElement,
                  unknown
                >,
              ) => void,
            ),
        (update) => update,
        (exit) => exit.remove(),
      );

    this.simulation.on("tick", () => {
      links
        .attr("x1", (d) => {
          return typeof d.source === "object"
            ? d.source.x || POSITION_X_CONSTANT
            : POSITION_X_CONSTANT;
        })
        .attr("y1", (d) => {
          return typeof d.source === "object"
            ? d.source.y || POSITION_Y_CONSTANT
            : POSITION_Y_CONSTANT;
        })
        .attr("x2", (d) => {
          return typeof d.target === "object"
            ? d.target.x || POSITION_X_CONSTANT
            : POSITION_X_CONSTANT;
        })
        .attr("y2", (d) => {
          return typeof d.target === "object"
            ? d.target.y || POSITION_Y_CONSTANT
            : POSITION_Y_CONSTANT;
        });

      nodes
        .attr("cx", (d) => {
          return d.x || POSITION_X_CONSTANT;
        })
        .attr("cy", (d) => {
          return d.y || POSITION_Y_CONSTANT;
        });
    });

    this.simulation.on("end", () => {
      console.log("simulation ended");
    });
  }
}
