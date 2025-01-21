import { least } from "d3-array";
import { drag as d3Drag } from "d3-drag";
import {
  type ForceLink,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { create as d3Create, select as d3Select } from "d3-selection";
import { type ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import { debounce } from "@/lib";
import type { LinkInterface } from "@/types/links";
import type { CachedNodeTextInterface, NodeInterface } from "@/types/nodes";
import {
  drawText,
  forceSettingsGetter,
  graphSettingsGetter,
  linkIterationExtractor,
  linkOptionsGetter,
  linkSettingsGetter,
  listenersGetter,
  nodeByPointerGetter,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
  nodeSettingsGetter,
  pointerGetter,
} from "./lib";
import type {
  GraphCanvasDragEvent,
  GraphCanvasForceSettings,
  GraphCanvasInterface,
  GraphCanvasLinkSettings,
  GraphCanvasListeners,
  GraphCanvasNodeSettings,
  GraphCanvasSettingInterface,
  GraphCanvasSimulation,
  GraphCanvasZoomEvent,
} from "./types";

export class GraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  /** initial data */

  private nodes: NodeInterface<NodeData>[];

  private links: LinkInterface<NodeData, LinkData>[];

  private width: number;

  private height: number;

  private root: HTMLElement;

  private container: HTMLDivElement | undefined | null;

  private area: HTMLCanvasElement | null | undefined;

  private dpi = devicePixelRatio;

  /** settings */

  private graphSettings: Required<GraphCanvasSettingInterface<NodeData>>;

  private forceSettings: Required<GraphCanvasForceSettings<NodeData, LinkData>>;

  private nodeSettings: Required<Omit<GraphCanvasNodeSettings<NodeData>, "options">> &
    Pick<GraphCanvasNodeSettings<NodeData>, "options">;

  private linkSettings: Required<Omit<GraphCanvasLinkSettings<NodeData, LinkData>, "options">> &
    Pick<GraphCanvasLinkSettings<NodeData, LinkData>, "options">;

  private listeners: GraphCanvasListeners<NodeData, LinkData>;

  /** service */

  private context: CanvasRenderingContext2D | null | undefined;

  private simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;

  private areaTransform: ZoomTransform = zoomIdentity;

  private areaRect: DOMRect | undefined;

  private draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  private cachedNodeText: CachedNodeTextInterface = {};

  private simulationWorking: boolean = false;

  private isDragging: boolean = false;

  private eventAbortController: AbortController;

  private highlightedNode: NodeInterface<NodeData> | null = null;

  private highlightedNeighbors: Set<string | number> | null = null;

  private fading: number = 0;

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

    this.forceSettings = forceSettingsGetter(forceSettings);
    this.linkSettings = linkSettingsGetter(linkSettings);
    this.nodeSettings = nodeSettingsGetter(nodeSettings);
    this.listeners = listenersGetter(listeners);
    this.graphSettings = graphSettingsGetter(graphSettings);

    this.eventAbortController = new AbortController();

    this.nodes = nodes;
    this.links = links;
    this.height = 0;
    this.width = 0;
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

    this.root.replaceChildren();
    this.area = undefined;
    this.context = undefined;
    this.container = undefined;
    this.eventAbortController.abort();
    this.eventAbortController = new AbortController();
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
          forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
            .id(this.nodeSettings.idGetter)
            .distance(this.forceSettings.linkDistance)
            .strength(this.forceSettings.linkStrength)
            .iterations(this.forceSettings.linkIterations),
        )
        .restart();
    }
  }

  private updateSize() {
    if (!this.area || !this.simulation || !this.container) return;

    const { width, height } = this.container.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.area.width = this.dpi * width;
    this.area.height = this.dpi * height;
    this.areaRect = this.area.getBoundingClientRect();

    this.simulation
      .stop()
      .alpha(1)
      .force(
        "center",

        forceCenter<NodeInterface<NodeData>>(
          this.forceSettings.centerPosition.x || this.width / 2,
          this.forceSettings.centerPosition.y || this.height / 2,
        ).strength(this.forceSettings.centerStrength),
      )
      .restart();

    if (!this.simulationWorking) this.draw();
  }

  private init() {
    this.initArea();
    this.initSimulation();
    this.initDnd();
    this.initZoom();
    this.initResize();
    this.initPointer();
  }

  private initSimulation() {
    if (!this.simulation) {
      this.simulation = forceSimulation<
        NodeInterface<NodeData>,
        LinkInterface<NodeData, LinkData>
      >()
        .nodes(this.nodes)
        .force(
          "link",
          forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links).id(
            this.nodeSettings.idGetter,
          ),
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

    const linkForce = this.simulation.force("link") as ForceLink<
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
        forceX<NodeInterface<NodeData>>(this.forceSettings.xForce).strength(
          this.forceSettings.xStrength,
        ),
      )
      .force(
        "y",
        forceY<NodeInterface<NodeData>>(this.forceSettings.yForce).strength(
          this.forceSettings.yStrength,
        ),
      )
      .force(
        "charge",
        forceManyBody<NodeInterface<NodeData>>()
          .strength(this.forceSettings.chargeStrength)
          .distanceMax(this.forceSettings.chargeDistanceMax)
          .distanceMin(this.forceSettings.chargeDistanceMin),
      )
      .force(
        "center",
        forceCenter<NodeInterface<NodeData>>(
          this.forceSettings.centerPosition.x || this.width / 2,
          this.forceSettings.centerPosition.y || this.height / 2,
        ).strength(this.forceSettings.centerStrength),
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
        forceCollide<NodeInterface<NodeData>>()
          .radius((node, index) => {
            if (this.forceSettings.collideRadius) {
              return nodeIterationExtractor(
                node,
                index,
                this.nodes,
                this.areaTransform,
                this.forceSettings.collideIterations,
                undefined,
              );
            }

            const nodeOptions = nodeIterationExtractor(
              node,
              index,
              this.nodes,
              this.areaTransform,
              this.nodeSettings.options || {},
              nodeOptionsGetter,
            );
            const radius = nodeRadiusGetter({
              radiusFlexible: nodeOptions.radiusFlexible,
              radiusInitial: nodeOptions.radiusInitial,
              radiusCoefficient: nodeOptions.radiusCoefficient,
              radiusFactor: nodeOptions.radiusFactor,
              linkCount: node.linkCount,
            });

            return radius + this.forceSettings.collideAdditionalRadius;
          })
          .strength(this.forceSettings.collideStrength)
          .iterations(this.forceSettings.collideIterations),
      );
  }

  private initArea() {
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

  private initDraw() {
    function draw(this: GraphCanvas<NodeData, LinkData>) {
      if (!this.context) return;

      if (this.listeners.onDraw) {
        return void this.listeners.onDraw(this.context, this.areaTransform);
      }

      if (this.highlightedNeighbors && this.highlightedNode) {
        if (this.fading === 0) this.fading = 1;
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

      if (this.fading > this.graphSettings.minFading) {
        this.fading -= 0.1;
        requestAnimationFrame(() => {
          this.draw();
        });
      }
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

      const linkOptions = linkIterationExtractor(
        link,
        index,
        this.links,
        this.areaTransform,
        this.linkSettings.options || {},
        linkOptionsGetter,
      );

      let alpha = linkOptions.alpha;
      if (this.highlightedNeighbors && this.highlightedNode) {
        if (
          this.highlightedNode.id != link.source.id &&
          this.highlightedNode.id != link.target.id
        ) {
          alpha = this.fading;
        }

        this.context.beginPath();
      }

      this.context.globalAlpha = alpha;
      this.context.strokeStyle = linkOptions.color;
      this.context.lineWidth = linkOptions.width;
      this.context.moveTo(link.source.x, link.source.y);
      this.context.lineTo(link.target.x, link.target.y);

      if (this.highlightedNeighbors && this.highlightedNode) this.context.stroke();
    }

    function drawNode(
      this: GraphCanvas<NodeData, LinkData>,
      node: NodeInterface<NodeData>,
      index: number,
    ) {
      if (!this.context || !node.x || !node.y) return;

      const nodeOptions = nodeIterationExtractor(
        node,
        index,
        this.nodes,
        this.areaTransform,
        this.nodeSettings.options || {},
        nodeOptionsGetter,
      );

      const radius = nodeRadiusGetter({
        radiusFlexible: nodeOptions.radiusFlexible,
        radiusInitial: nodeOptions.radiusInitial,
        radiusCoefficient: nodeOptions.radiusCoefficient,
        radiusFactor: nodeOptions.radiusFactor,
        linkCount: node.linkCount,
      });

      let alpha = nodeOptions.alpha;
      if (this.highlightedNeighbors && this.highlightedNode) {
        if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
          alpha = this.fading;
        }
      }

      this.context.beginPath();
      this.context.globalAlpha = alpha;

      /** text */
      if (nodeOptions.textVisible && nodeOptions.text) {
        drawText({
          id: node.id,
          cachedNodeText: this.cachedNodeText,
          context: this.context,
          text: nodeOptions.text,
          textAlign: nodeOptions.textAlign,
          textColor: nodeOptions.textColor,
          textFont: nodeOptions.textFont,
          textSize: nodeOptions.textSize,
          x: node.x + nodeOptions.textShiftX,
          y: node.y + radius + nodeOptions.textShiftY,
          maxWidth: nodeOptions.textWidth,
          textStyle: nodeOptions.textStyle,
          textWeight: nodeOptions.textWeight,
          textGap: nodeOptions.textGap,
        });
      }
      /** circle */
      this.context.lineWidth = 1;
      this.context.strokeStyle = "black";
      this.context.fillStyle = nodeOptions.color;
      this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

      this.context.fill();
      this.context.stroke();
    }

    return draw;
  }

  private initResize() {
    if (!this.area) throw new Error("bad init data");

    const resize = debounce(() => {
      this.updateSize();
    }, 10);

    window.addEventListener(
      "resize",
      () => {
        requestAnimationFrame(() => {
          resize();
        });
      },
      { signal: this.eventAbortController.signal },
    );
  }

  private initPointer() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    this.area.addEventListener(
      "pointermove",
      (event) => {
        let currentNode: NodeInterface<NodeData> | undefined;

        if (this.graphSettings.highlightByHover) {
          currentNode = nodeByPointerGetter({
            nodeCustomOptions: this.nodeSettings.options,
            areaRect: this.areaRect,
            areaTransform: this.areaTransform,
            mouseEvent: event,
            nodes: this.nodes,
          });

          if (currentNode && currentNode.neighbors && this.highlightedNode !== currentNode) {
            this.highlightedNode = currentNode;
            this.highlightedNeighbors = new Set(this.highlightedNode.neighbors);
            requestAnimationFrame(() => {
              this.draw();
            });
          } else if (!currentNode && this.highlightedNode) {
            this.highlightedNode = null;
            this.highlightedNeighbors = null;
            requestAnimationFrame(() => {
              this.draw();
            });
          }
        }

        if (!this.listeners.onMove) return;

        if (!currentNode)
          currentNode = nodeByPointerGetter({
            nodeCustomOptions: this.nodeSettings.options,
            areaRect: this.areaRect,
            areaTransform: this.areaTransform,
            mouseEvent: event,
            nodes: this.nodes,
          });

        return void this.listeners.onMove(event, currentNode);
      },
      {
        signal: this.eventAbortController.signal,
      },
    );

    this.area.addEventListener("dblclick", (event) => {
      if (!this.listeners.onDoubleClick) return;

      const currentNode = nodeByPointerGetter({
        nodeCustomOptions: this.nodeSettings.options,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });

      return void this.listeners.onDoubleClick(event, currentNode);
    });

    this.area.addEventListener(
      "pointerup",
      (event) => {
        if (this.isDragging) return;
        if (event.button === 0) {
          if (!this.listeners.onClick) return;

          const currentNode = nodeByPointerGetter({
            nodeCustomOptions: this.nodeSettings.options,
            areaRect: this.areaRect,
            areaTransform: this.areaTransform,
            mouseEvent: event,
            nodes: this.nodes,
          });

          return void this.listeners.onClick(event, currentNode);
        }
        if (event.button === 1) {
          if (!this.listeners.onWheelClick) return;

          const currentNode = nodeByPointerGetter({
            nodeCustomOptions: this.nodeSettings.options,
            areaRect: this.areaRect,
            areaTransform: this.areaTransform,
            mouseEvent: event,
            nodes: this.nodes,
          });

          return void this.listeners.onWheelClick(event, currentNode);
        }
      },
      {
        signal: this.eventAbortController.signal,
      },
    );

    this.area.addEventListener(
      "contextmenu",
      (event) => {
        if (!this.listeners.onContextMenu) return;

        const currentNode = nodeByPointerGetter({
          nodeCustomOptions: this.nodeSettings.options,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          nodes: this.nodes,
        });

        return void this.listeners.onContextMenu(event, currentNode);
      },
      {
        signal: this.eventAbortController.signal,
      },
    );
  }

  private initDnd() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    d3Select(this.area).call(
      d3Drag<HTMLCanvasElement, unknown>()
        .subject((event: GraphCanvasDragEvent<NodeData>) => {
          if (this.listeners.onDragSubject) {
            return this.listeners.onDragSubject(event, this.areaTransform, this.nodes);
          }

          if (!this.areaRect) return;

          const mouseEvent = event.sourceEvent as MouseEvent;
          const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);

          let index = 0;

          return least(this.nodes, (node) => {
            if (!node.x || !node.y) return undefined;

            const nodeOptions = nodeIterationExtractor(
              node,
              index,
              this.nodes,
              this.areaTransform,
              this.nodeSettings.options || {},
              nodeOptionsGetter,
            );

            const radius = nodeRadiusGetter({
              radiusFlexible: nodeOptions.radiusFlexible,
              radiusInitial: nodeOptions.radiusInitial,
              radiusCoefficient: nodeOptions.radiusCoefficient,
              radiusFactor: nodeOptions.radiusFactor,
              linkCount: node.linkCount,
            });
            index++;

            return this.graphSettings.dragPlaceCoefficient(node, pointerX, pointerY, radius);
          });
        })
        .on("start", (event: GraphCanvasDragEvent<NodeData>) => {
          this.listeners.onStartDragFinished?.(event, this.simulation, this.areaTransform);
        })
        .on("drag", (event: GraphCanvasDragEvent<NodeData>) => {
          if (!this.isDragging) {
            this.isDragging = true;
            if (this.simulation) this.simulation.alphaTarget(0.3).restart();
          }

          if (!this.areaRect) return;
          const mouseEvent = event.sourceEvent as MouseEvent;
          const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);
          event.subject.fx = pointerX;
          event.subject.fy = pointerY;

          this.listeners.onMoveDragFinished?.(event, this.simulation, this.areaTransform);
        })
        .on("end", (event: GraphCanvasDragEvent<NodeData>) => {
          this.isDragging = false;

          if (!event.active && this.simulation) this.simulation.alphaTarget(0);

          if (this.graphSettings.stickAfterDrag && this.areaRect) {
            if (!this.areaRect) return;
            const mouseEvent = event.sourceEvent as MouseEvent;
            const [pointerX, pointerY] = pointerGetter(
              mouseEvent,
              this.areaRect,
              this.areaTransform,
            );
            event.subject.fx = pointerX;
            event.subject.fy = pointerY;
          } else {
            event.subject.fx = null;
            event.subject.fy = null;
          }

          this.listeners.onEndDragFinished?.(event, this.simulation, this.areaTransform);
        }),
    );
  }

  private initZoom() {
    if (!this.area) throw new Error("bad init data");

    d3Select(this.area)
      .call(
        zoom<HTMLCanvasElement, unknown>()
          .scaleExtent(this.graphSettings.zoomExtent)
          .on("zoom", (event: GraphCanvasZoomEvent) => {
            this.listeners.onZoom?.(event);
            this.areaTransform = event.transform;

            if (!this.simulationWorking) requestAnimationFrame(() => this.draw());
          }),
      )
      .on("dblclick.zoom", null);

    // console.log(zoomTransform(this.area));

    // zoom().scaleTo(d3Select(this.area), 4);
    // this.areaTransform = zoomIdentity.translate(200, 0).scale(4);
  }
}
