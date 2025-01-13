/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as d3 from "d3";
import type { LinkInterface } from "@/types/links";
import type { NodeInterface } from "@/types/nodes";
import type {
  ForceOptions,
  GraphCanvasInterface,
  GraphSettingInterface,
  LinkOptions,
  Listeners,
  NodeOptions,
} from "./GraphCanvas.types";
import { linkIterationExtractor, nodeColorGetter, nodeIdGetter } from "./lib";

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

  private context: CanvasRenderingContext2D | null | undefined;

  private linksNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private nodesNode: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> | undefined;

  private color = d3.scaleOrdinal(d3.schemeCategory10);

  private dpi = devicePixelRatio;

  private areaTransform: d3.ZoomTransform = d3.zoomIdentity;

  private draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  private settings: Required<GraphSettingInterface>;

  private forceOptions: Required<ForceOptions<NodeData, LinkData>>;

  private nodeOptions: Required<NodeOptions<NodeData>>;

  private linkOptions: Required<LinkOptions<NodeData, LinkData>>;

  private listeners: Required<Listeners>;

  constructor({
    links,
    nodes,
    root,
    forceOptions,
    linkOptions,
    listeners,
    nodeOptions,
    settings,
  }: GraphCanvasInterface<NodeData, LinkData>) {
    root.style.position = "relative";
    root.style.overflow = "hidden";

    this.root = root;
    const { width, height } = root.getBoundingClientRect();

    this.forceOptions = {
      centerPosition: forceOptions?.centerPosition ?? {},
      centerStrength: forceOptions?.centerStrength ?? 1,
      collideRadius: forceOptions?.collideRadius ?? 10,
      collideStrength: forceOptions?.collideStrength ?? 1,
      collideIterations: forceOptions?.collideIterations ?? 1,
      collideOffMax: forceOptions?.collideOffMax ?? { links: 0, nodes: 0 },
      chargeStrength: forceOptions?.chargeStrength ?? -65,
      chargeDistanceMax: forceOptions?.chargeDistanceMax ?? Infinity,
      chargeDistanceMin: forceOptions?.chargeDistanceMin ?? 1,
      xForce: forceOptions?.xForce ?? 0,
      xStrength: forceOptions?.xStrength ?? 0.1,
      yForce: forceOptions?.yForce ?? 0,
      yStrength: forceOptions?.yStrength ?? 0.1,
      linkDistance: forceOptions?.linkDistance ?? 10,
      linkIterations: forceOptions?.linkIterations ?? 1,
      linkStrength: forceOptions?.linkStrength ?? 1,
    };
    this.linkOptions = {
      alpha: linkOptions?.alpha ?? 1,
      color: linkOptions?.color ?? "#999",
      width: linkOptions?.width ?? 1,
    };

    this.nodeOptions = {
      idGetter: nodeOptions?.idGetter ?? nodeIdGetter,
      radius: nodeOptions?.radius ?? 5,
      width: nodeOptions?.width ?? 1,
      alpha: nodeOptions?.alpha ?? 1,
      colorInner: nodeOptions?.colorInner ?? nodeColorGetter,
      colorOuter: nodeOptions?.colorOuter ?? "#fff",
      font: nodeOptions?.font ?? "8px Arial",
      fontAlign: nodeOptions?.fontAlign ?? "center",
      fontColor: nodeOptions?.fontColor ?? "#333",
    };
    this.listeners = {};
    this.settings = {};

    this.nodes = nodes;
    this.links = links;
    this.height = height;
    this.width = width;
    this.draw = this.initDraw();

    this.init();
  }

  getData(): Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> {
    return {
      links: this.links,
      nodes: this.nodes,
    };
  }

  changeData(options: Omit<Partial<GraphCanvasInterface<NodeData, LinkData>>, "selector">) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;

    this.updateData();
  }

  start() {
    this.init();
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
  }

  private updateData() {
    if (this.simulation) {
      if (this.nodes.length + this.links.length > 2000) this.simulation.force("collide", null);

      this.simulation
        .stop()
        .alpha(1)
        .nodes(this.nodes)
        .force(
          "link",
          d3
            .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
            .id(this.nodeOptions.idGetter)
            .distance(this.forceOptions.linkDistance)
            .strength(this.forceOptions.linkStrength)
            .iterations(this.forceOptions.linkIterations),
        )
        .restart();
    }
  }

  private init() {
    this.initSimulation();
    this.initArea();
    this.initDnd();
    this.initZoom();
  }

  private initSimulation() {
    if (!this.simulation) {
      this.simulation = d3
        .forceSimulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>()

        .nodes(this.nodes)
        .force(
          "link",
          d3
            .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
            .id(this.nodeOptions.idGetter)
            .distance(this.forceOptions.linkDistance)
            .strength(this.forceOptions.linkStrength)
            .iterations(this.forceOptions.linkIterations),
        )
        .force(
          "x",
          d3
            .forceX<NodeInterface<NodeData>>(this.forceOptions.xForce)
            .strength(this.forceOptions.xStrength),
        )
        .force(
          "y",
          d3
            .forceY<NodeInterface<NodeData>>(this.forceOptions.yForce)
            .strength(this.forceOptions.yStrength),
        )
        .force(
          "charge",
          d3
            .forceManyBody<NodeInterface<NodeData>>()
            .strength(this.forceOptions.chargeStrength)
            .distanceMax(this.forceOptions.chargeDistanceMax)
            .distanceMin(this.forceOptions.chargeDistanceMin),
        )
        .force(
          "center",
          d3
            .forceCenter<
              NodeInterface<NodeData>
            >(this.forceOptions.centerPosition.x || this.width / 2, this.forceOptions.centerPosition.y || this.height / 2)
            .strength(this.forceOptions.centerStrength),
        )
        .force(
          "collide",
          d3
            .forceCollide<NodeInterface<NodeData>>()
            .radius(this.forceOptions.collideRadius)
            .strength(this.forceOptions.collideStrength)
            .iterations(this.forceOptions.collideIterations),
        )
        .on("tick", this.draw.bind(this))
        .on("end", () => {
          console.log("simulation ended");
        });

      const isHasMax =
        this.forceOptions.collideOffMax.links != 0 && this.forceOptions.collideOffMax.nodes != 0;
      const isMaxCollideNodes =
        isHasMax && this.forceOptions.collideOffMax.nodes < this.nodes.length;
      const isMaxCollideLinks =
        isHasMax && this.forceOptions.collideOffMax.links < this.links.length;
      if (isMaxCollideNodes && isMaxCollideLinks) this.simulation.force("collide", null);
    }
  }

  private initArea() {
    if (!this.area || !this.context) {
      this.area = d3
        .create("canvas")
        .attr("width", this.dpi * this.width)
        .attr("height", this.dpi * this.height)
        .attr("style", `width: 100%; height: 100%; `)
        .node();

      if (!this.area) throw new Error("couldn't create canvas");

      this.context = this.area.getContext("2d");
      if (!this.context) throw new Error("couldn't create canvas context");
      this.context.scale(this.dpi, this.dpi);

      this.root.appendChild(this.area);
    }
  }

  private initDraw() {
    function draw(this: GraphCanvas<NodeData, LinkData>) {
      if (!this.context) return;
      this.context.save();

      this.context.clearRect(0, 0, this.width, this.height);
      this.context.translate(this.areaTransform.x, this.areaTransform.y);
      this.context.scale(this.areaTransform.k, this.areaTransform.k);

      /** links */
      this.context.beginPath();
      this.links.forEach(drawLink.bind(this));
      this.context.stroke();

      /** nodes */
      this.nodes.forEach(drawNode.bind(this));

      this.context.restore();
    }

    function drawLink(
      this: GraphCanvas<NodeData, LinkData>,
      link: LinkInterface<NodeData, LinkData>,
      index: number,
    ) {
      if (
        !this.context ||
        typeof link.source !== "object" ||
        typeof link.target !== "object" ||
        !link.source.x ||
        !link.source.y ||
        !link.target.x ||
        !link.target.y
      )
        return;

      this.context.globalAlpha = linkIterationExtractor(
        link,
        index,
        this.links,
        this.linkOptions.alpha,
      );
      this.context.strokeStyle = linkIterationExtractor(
        link,
        index,
        this.links,
        this.linkOptions.color,
      );
      this.context.lineWidth = linkIterationExtractor(
        link,
        index,
        this.links,
        this.linkOptions.width,
      );
      this.context.moveTo(link.source.x, link.source.y);
      this.context.lineTo(link.target.x, link.target.y);
    }

    function drawNode(this: GraphCanvas<NodeData, LinkData>, node: NodeInterface<NodeData>) {
      if (!this.context || !node.x || !node.y) return;

      this.context.beginPath();

      /** text */
      this.context.font = "8px Arial";
      this.context.fillStyle = "#333";
      this.context.textAlign = "center";
      /** circle */
      this.context.strokeStyle = "#fff";
      this.context.globalAlpha = 1;
      this.context.lineWidth = 1;
      this.context.fillText(`${node.index}`, node.x, node.y + 5 * 2 + 3);
      this.context.moveTo(node.x + 5, node.y);
      this.context.arc(node.x, node.y, 5, 0, 2 * Math.PI);

      this.context.fillStyle = this.color(String(node.group));

      this.context.fill();
      this.context.stroke();
    }

    return draw;
  }

  private initDnd() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    d3.select(this.area).call(
      d3
        .drag()
        .subject((event) => {
          const [_px, _py] = d3.pointer(event, this.area);
          const px = (_px - this.areaTransform.x) / this.areaTransform.k;
          const py = (_py - this.areaTransform.y) / this.areaTransform.k;

          return d3.least(this.nodes, (node) => {
            if (!node.x || !node.y) return undefined;

            const dist2 = (node.x - px) ** 2 + (node.y - py) ** 2;

            if (dist2 < 30) return dist2;
          });
        })
        .on("start", (event) => {
          if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();

          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event) => {
          const [_px, _py] = d3.pointer(event, this.area);
          const px = (_px - this.areaTransform.x) / this.areaTransform.k;
          const py = (_py - this.areaTransform.y) / this.areaTransform.k;

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
          const areaTransform = event.transform as d3.ZoomTransform;
          this.areaTransform = areaTransform;
          this.draw();
        }) as unknown as d3.ZoomBehavior<HTMLCanvasElement, unknown>,
    );
  }
}
