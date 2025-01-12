/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as d3 from "d3";
import type { LinkInterface } from "@/types/links";
import type { NodeInterface } from "@/types/nodes";
import type { GraphCanvasInterface } from "./GraphCanvas.types";

export class GraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  private nodes: NodeInterface<NodeData>[];

  private links: LinkInterface<NodeData, LinkData>[];

  private width: number;

  private height: number;

  private simulation:
    | d3.Simulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>
    | undefined;

  private root: HTMLElement;

  private area: HTMLCanvasElement | null | undefined;

  private zoomGhost: SVGElement | null | undefined;

  private context: CanvasRenderingContext2D | null | undefined;

  private linksNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private nodesNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private color = d3.scaleOrdinal(d3.schemeCategory10);

  private dpi = devicePixelRatio;

  private transform: d3.ZoomTransform = d3.zoomIdentity;

  private draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  constructor({ links, nodes, root }: GraphCanvasInterface<NodeData, LinkData>) {
    root.style.position = "relative";
    root.style.overflow = "hidden";

    this.root = root;
    const { width, height } = root.getBoundingClientRect();

    this.nodes = nodes;
    this.links = links;
    this.height = height;
    this.width = width;
    this.draw = this.initDraw();

    this.refreshSimulation();
  }

  changeData(options: Omit<Partial<GraphCanvasInterface<NodeData, LinkData>>, "selector">) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;

    this.refreshSimulation();
  }

  start() {
    this.refreshSimulation();
  }

  destroy() {
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

    this.root.replaceChildren();
    this.area = undefined;
    this.zoomGhost = undefined;
  }

  private refreshSimulation() {
    if (!this.simulation) {
      this.simulation = d3.forceSimulation<
        NodeInterface<NodeData>,
        LinkInterface<NodeData, LinkData>
      >();
    }
    if (!this.area || !this.context) {
      this.area = d3
        .create("canvas")
        .attr("width", this.dpi * this.width)
        .attr("height", this.dpi * this.height)
        .attr(
          "style",
          `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;`,
        )
        .node();

      if (!this.area) throw new Error("couldn't create canvas");

      this.context = this.area.getContext("2d");
      if (!this.context) throw new Error("couldn't create canvas context");
      this.context.scale(this.dpi, this.dpi);

      this.root.appendChild(this.area);
    }
    if (!this.zoomGhost) {
      this.zoomGhost = d3
        .create("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", `width: 100%; height: 100%; z-index: 0; visibility: hidden;`)
        .append("g")
        .node();

      if (!this.zoomGhost || !this.zoomGhost.parentElement)
        throw new Error("couldn't create zoomGhost");
      this.root.appendChild(this.zoomGhost.parentElement);
    }

    this.simulation
      .nodes(this.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
          .id((d) => d.id)
          .distance(10)
          .strength(1),
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("charge", d3.forceManyBody<NodeInterface<NodeData>>().strength(-15))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2).strength(1))
      .force("collide", d3.forceCollide().radius(7).strength(1).iterations(1))
      .on("tick", this.draw.bind(this))
      .on("end", () => {
        console.log("simulation ended");
      })
      .restart()
      .tick();

    this.initDnd();
    this.initZoom();
  }

  private initDraw() {
    function draw(this: GraphCanvas<NodeData, LinkData>) {
      if (!this.context) return;
      this.context.save();

      this.context.clearRect(0, 0, this.width, this.height);
      this.context.translate(this.transform.x, this.transform.y);
      this.context.scale(this.transform.k, this.transform.k);

      this.context.globalAlpha = 0.6;
      this.context.strokeStyle = "#999";
      this.context.beginPath();
      this.links.forEach(drawLink.bind(this));
      this.context.stroke();

      this.context.strokeStyle = "#fff";
      this.context.globalAlpha = 1;
      this.nodes.forEach((node) => {
        if (!this.context) return;

        this.context.beginPath();
        drawNode.bind(this)(node);
        this.context.fillStyle = this.color(String(node.group));
        this.context.strokeStyle = "#fff";
        this.context.fill();
        this.context.stroke();
      });
      this.context.restore();
    }

    function drawLink(this: GraphCanvas<NodeData, LinkData>, d: LinkInterface<NodeData, LinkData>) {
      if (
        !this.context ||
        typeof d.source !== "object" ||
        typeof d.target !== "object" ||
        !d.source.x ||
        !d.source.y ||
        !d.target.x ||
        !d.target.y
      )
        return;

      this.context.moveTo(d.source.x, d.source.y);
      this.context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(this: GraphCanvas<NodeData, LinkData>, d: NodeInterface<NodeData>) {
      if (!this.context || !d.x || !d.y) return;

      this.context.moveTo(d.x + 5, d.y);
      this.context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
    }

    return draw;
  }

  private initDnd() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    d3.select(this.area).call(
      d3
        .drag()
        .subject((event) => {
          const [px, py] = d3.pointer(event, this.zoomGhost);

          return d3.least(this.nodes, (node) => {
            if (!node.x || !node.y) return undefined;

            const dist2 = (node.x - px) ** 2 + (node.y - py) ** 2;
            if (dist2 < 400) return dist2;
          });
        })
        .on("start", (event) => {
          if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event) => {
          const [px, py] = d3.pointer(event, this.zoomGhost);
          event.subject.fx = px;
          event.subject.fy = py;
        })
        .on("end", (event) => {
          if (!event.active && this.simulation) this.simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }) as unknown as (
        selection: d3.Selection<HTMLCanvasElement, unknown, null, undefined>,
      ) => void,
    );
  }

  private initZoom() {
    if (!this.area) throw new Error("bad init data");

    d3.select(this.area).call(
      d3
        .zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", (event) => {
          const transform = event.transform as d3.ZoomTransform;
          this.transform = transform;
          if (this.zoomGhost) {
            d3.select(this.zoomGhost).attr("transform", transform as unknown as string);
          }
          this.draw();
        }) as unknown as d3.ZoomBehavior<HTMLCanvasElement, unknown>,
    );
  }
}
