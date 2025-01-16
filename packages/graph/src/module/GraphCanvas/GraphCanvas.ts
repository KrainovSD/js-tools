import * as d3 from "d3";
import type { LinkInterface } from "@/types/links";
import type { NodeInterface } from "@/types/nodes";
import {
  forceSettingsGetter,
  graphSettingsGetter,
  linkIterationExtractor,
  linkOptionsGetter,
  linkSettingsGetter,
  listenersGetter,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeSettingsGetter,
} from "./lib";
import type {
  GraphCanvasDragEvent,
  GraphCanvasForceSettings,
  GraphCanvasInterface,
  GraphCanvasLinkOptions,
  GraphCanvasLinkSettings,
  GraphCanvasListeners,
  GraphCanvasNodeOptions,
  GraphCanvasNodeSettings,
  GraphCanvasSelection,
  GraphCanvasSettingInterface,
  GraphCanvasSimulation,
  GraphCanvasZoomEvent,
} from "./types";

export class GraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  private nodes: NodeInterface<NodeData>[];

  private links: LinkInterface<NodeData, LinkData>[];

  private width: number;

  private height: number;

  private simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;

  private root: HTMLElement;

  private area: HTMLCanvasElement | null | undefined;

  private context: CanvasRenderingContext2D | null | undefined;

  private linksNode: GraphCanvasSelection | undefined;

  private nodesNode: GraphCanvasSelection | undefined;

  private dpi = devicePixelRatio;

  private areaTransform: d3.ZoomTransform = d3.zoomIdentity;

  private draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  private graphSettings: Required<GraphCanvasSettingInterface<NodeData>>;

  private forceSettings: Required<GraphCanvasForceSettings<NodeData, LinkData>>;

  private nodeSettings: Required<Omit<GraphCanvasNodeSettings<NodeData>, "options">> &
    Pick<GraphCanvasNodeSettings<NodeData>, "options">;

  private linkSettings: Required<Omit<GraphCanvasLinkSettings<NodeData, LinkData>, "options">> &
    Pick<GraphCanvasLinkSettings<NodeData, LinkData>, "options">;

  private listeners: GraphCanvasListeners<NodeData, LinkData>;

  private simulationWorking: boolean = false;

  constructor({
    links,
    nodes,
    root,
    forceSettings,
    linkSettings,
    listeners,
    nodeSettings,
    graphSettings,
  }: GraphCanvasInterface<NodeData, LinkData>) {
    root.style.position = "relative";
    root.style.overflow = "hidden";

    this.root = root;
    const { width, height } = root.getBoundingClientRect();

    this.forceSettings = forceSettingsGetter(forceSettings);
    this.linkSettings = linkSettingsGetter(linkSettings);
    this.nodeSettings = nodeSettingsGetter(nodeSettings);
    this.listeners = listenersGetter(listeners);
    this.graphSettings = graphSettingsGetter(graphSettings);

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

  changeData(options: Pick<Partial<GraphCanvasInterface<NodeData, LinkData>>, "links" | "nodes">) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;

    this.updateData();
  }

  changeSettings(
    options: Omit<
      Partial<GraphCanvasInterface<NodeData, LinkData>>,
      "links" | "nodes" | "listeners"
    >,
  ) {
    if (options.forceSettings) this.forceSettings = forceSettingsGetter(options.forceSettings);
    if (options.linkSettings) this.linkSettings = linkSettingsGetter(options.linkSettings);
    if (options.nodeSettings) this.nodeSettings = nodeSettingsGetter(options.nodeSettings);
    if (options.graphSettings) this.graphSettings = graphSettingsGetter(options.graphSettings);

    this.updateSettings();
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

  private updateSettings() {
    if (this.simulation) {
      this.simulation.stop().alpha(1);
      this.initSimulationForces();
      this.simulation.restart();
    }
  }

  private updateData() {
    if (this.simulation) {
      this.initCollideForce();

      this.simulation
        .stop()
        .alpha(1)
        .nodes(this.nodes)
        .force(
          "link",
          d3
            .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
            .id(this.nodeSettings.idGetter)
            .distance(this.forceSettings.linkDistance)
            .strength(this.forceSettings.linkStrength)
            .iterations(this.forceSettings.linkIterations),
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
            .id(this.nodeSettings.idGetter),
        )
        .on("tick", () => {
          this.simulationWorking = true;
          this.draw();
        })
        .on("end", () => {
          this.listeners.onSimulationEnd?.(this.simulation);
          this.simulationWorking = false;
        });
      this.initSimulationForces();
    }
  }

  private initSimulationForces() {
    if (!this.simulation) return;

    const linkForce = this.simulation.force("link") as d3.ForceLink<
      NodeInterface<NodeData>,
      LinkInterface<NodeData, LinkData>
    >;
    linkForce
      .distance(this.forceSettings.linkDistance)
      .strength(this.forceSettings.linkStrength)
      .iterations(this.forceSettings.linkIterations);

    this.simulation
      .force(
        "x",
        d3
          .forceX<NodeInterface<NodeData>>(this.forceSettings.xForce)
          .strength(this.forceSettings.xStrength),
      )
      .force(
        "y",
        d3
          .forceY<NodeInterface<NodeData>>(this.forceSettings.yForce)
          .strength(this.forceSettings.yStrength),
      )
      .force(
        "charge",
        d3
          .forceManyBody<NodeInterface<NodeData>>()
          .strength(this.forceSettings.chargeStrength)
          .distanceMax(this.forceSettings.chargeDistanceMax)
          .distanceMin(this.forceSettings.chargeDistanceMin),
      )
      .force(
        "center",
        d3
          .forceCenter<
            NodeInterface<NodeData>
          >(this.forceSettings.centerPosition.x || this.width / 2, this.forceSettings.centerPosition.y || this.height / 2)
          .strength(this.forceSettings.centerStrength),
      );

    this.initCollideForce();
  }

  private initCollideForce() {
    if (!this.simulation) return;

    if (!this.forceSettings.collideOn) {
      if (this.simulation.force("collide")) this.simulation.force("collide", null);

      return;
    }

    const isHasMax =
      this.forceSettings.collideOffMax.links != 0 && this.forceSettings.collideOffMax.nodes != 0;
    const isMaxCollideNodes =
      isHasMax && this.forceSettings.collideOffMax.nodes < this.nodes.length;
    const isMaxCollideLinks =
      isHasMax && this.forceSettings.collideOffMax.links < this.links.length;
    if (isMaxCollideNodes && isMaxCollideLinks) this.simulation.force("collide", null);
    else if (!this.simulation.force("collide"))
      this.simulation.force(
        "collide",
        d3
          .forceCollide<NodeInterface<NodeData>>()
          .radius(this.forceSettings.collideRadius)
          .strength(this.forceSettings.collideStrength)
          .iterations(this.forceSettings.collideIterations),
      );
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

      if (this.listeners.onDraw) {
        return void this.listeners.onDraw(this.context, this.areaTransform);
      }

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

      this.listeners.onDrawFinished?.(this.context, this.areaTransform);
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

      const linkCustomOptions = linkIterationExtractor(
        link,
        index,
        this.links,
        this.areaTransform,
        this.linkSettings.options || {},
      );
      const linkConstantOptions = linkOptionsGetter(link, index, this.links, this.areaTransform);
      const linkOptions: Required<GraphCanvasLinkOptions> = {
        ...linkConstantOptions,
        ...linkCustomOptions,
      };

      this.context.globalAlpha = linkOptions.alpha;
      this.context.strokeStyle = linkOptions.color;
      this.context.lineWidth = linkOptions.width;
      this.context.moveTo(link.source.x, link.source.y);
      this.context.lineTo(link.target.x, link.target.y);
    }

    function drawNode(
      this: GraphCanvas<NodeData, LinkData>,
      node: NodeInterface<NodeData>,
      index: number,
    ) {
      if (!this.context || !node.x || !node.y) return;

      const nodeCustomOptions = nodeIterationExtractor(
        node,
        index,
        this.nodes,
        this.areaTransform,
        this.nodeSettings.options || {},
      );
      const nodeConstantOptions = nodeOptionsGetter(node, index, this.nodes, this.areaTransform);
      const nodeOptions: Required<GraphCanvasNodeOptions> = {
        ...nodeConstantOptions,
        ...nodeCustomOptions,
      };

      this.context.beginPath();

      /** text */
      if (nodeOptions.text) {
        this.context.font = nodeOptions.font;
        this.context.fillStyle = nodeOptions.fontColor;
        this.context.textAlign = nodeOptions.fontAlign;
        this.context.fillText(`${node.index}`, node.x, node.y + 5 * 2 + 3);
      }
      /** circle */
      this.context.strokeStyle = nodeOptions.colorOuter;
      this.context.globalAlpha = nodeOptions.alpha;
      this.context.lineWidth = nodeOptions.width;
      this.context.moveTo(node.x + nodeOptions.radius, node.y);
      this.context.arc(node.x, node.y, nodeOptions.radius, 0, 2 * Math.PI);

      this.context.fillStyle = nodeOptions.colorInner;

      this.context.fill();
      this.context.stroke();
    }

    return draw;
  }

  private initDnd() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    d3.select(this.area).call(
      d3
        .drag<HTMLCanvasElement, unknown>()
        .subject((event) => {
          if (this.listeners.onDragSubject) {
            return this.listeners.onDragSubject(event, this.areaTransform, this.nodes);
          }

          const [_px, _py] = d3.pointer(event, this.area);
          const px = (_px - this.areaTransform.x) / this.areaTransform.k;
          const py = (_py - this.areaTransform.y) / this.areaTransform.k;

          return d3.least(this.nodes, (node) => {
            if (!node.x || !node.y) return undefined;

            let dragPlaceCoefficient: number | undefined;
            if (typeof this.graphSettings.dragPlaceCoefficient === "function")
              dragPlaceCoefficient = this.graphSettings.dragPlaceCoefficient(node, px, py);
            else dragPlaceCoefficient = this.graphSettings.dragPlaceCoefficient;

            if (dragPlaceCoefficient == undefined) return undefined;

            if (dragPlaceCoefficient < 30) return dragPlaceCoefficient;
          });
        })
        .on("start", (event: GraphCanvasDragEvent<NodeData>) => {
          if (this.listeners.onStartDrag) {
            return void this.listeners.onStartDrag(event, this.simulation);
          }

          if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();

          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;

          this.listeners.onStartDragFinished?.(event, this.simulation);
        })
        .on("drag", (event: GraphCanvasDragEvent<NodeData>) => {
          if (this.listeners.onMoveDrag) {
            return void this.listeners.onMoveDrag(event, this.simulation);
          }

          const [_px, _py] = d3.pointer(event, this.area);
          const px = (_px - this.areaTransform.x) / this.areaTransform.k;
          const py = (_py - this.areaTransform.y) / this.areaTransform.k;

          event.subject.fx = px;
          event.subject.fy = py;

          this.listeners.onMoveDragFinished?.(event, this.simulation);
        })
        .on("end", (event: GraphCanvasDragEvent<NodeData>) => {
          if (this.listeners.onEndDrag) {
            return void this.listeners.onEndDrag(event, this.simulation);
          }

          if (!event.active && this.simulation) this.simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;

          this.listeners.onEndDragFinished?.(event, this.simulation);
        }),
    );
  }

  private initZoom() {
    if (!this.area) throw new Error("bad init data");

    d3.select(this.area).call(
      d3
        .zoom<HTMLCanvasElement, unknown>()
        .scaleExtent(this.graphSettings.zoomExtent)
        .on("zoom", (event: GraphCanvasZoomEvent) => {
          this.listeners.onZoom?.(event);
          this.areaTransform = event.transform;

          if (!this.simulationWorking) requestAnimationFrame(() => this.draw());
        }),
    );
  }
}
