import { isArray, isBoolean } from "@krainovsd/js-helpers";
import { greatest } from "d3-array";
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
import { ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import {
  colorToRgb,
  extractRgb,
  fadeRgb,
  getDrawTime,
  rgbAnimationByProgress,
  setDrawTime,
} from "@/lib";
import type { LinkInterface } from "@/types/links";
import type { CachedNodeTextInterface, NodeInterface } from "@/types/nodes";
import {
  animationByProgress,
  calculateLinkPositionByRadius,
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
  DragEventInterface,
  ForceSettingsInterface,
  GraphCanvasInterface,
  GraphCanvasSimulation,
  GraphSettingsInterface,
  GraphState,
  LinkSettingsInterface,
  ListenersInterface,
  NodeSettingsInterface,
  ZoomEventInterface,
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

  /** settings */

  private graphSettings: Required<GraphSettingsInterface<NodeData>>;

  private forceSettings: Required<ForceSettingsInterface<NodeData, LinkData>>;

  private nodeSettings: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">;

  private linkSettings: Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<LinkSettingsInterface<NodeData, LinkData>, "options">;

  private listeners: ListenersInterface<NodeData, LinkData>;

  /** service */

  private context: CanvasRenderingContext2D | null | undefined;

  private simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;

  private areaTransform: ZoomTransform = zoomIdentity;

  private areaRect: DOMRect | undefined;

  private draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  private eventAbortController: AbortController;

  private cachedNodeText: CachedNodeTextInterface = {};

  private isDragging: boolean = false;

  private highlightedNode: NodeInterface<NodeData> | null = null;

  private highlightedNeighbors: Set<string | number> | null = null;

  private highlightProgress: number = 1;

  private highlightWorking: boolean = false;

  private highlightDrawing: boolean = false;

  private get simulationWorking() {
    const simulationAlpha = this.simulation?.alpha?.() ?? 0;
    const simulationAlphaMin = this.simulation?.alphaMin?.() ?? 0;
    const simulationAlphaDecay = this.simulation?.alphaDecay?.() ?? 0;
    const force = (simulationAlpha - simulationAlphaMin) / simulationAlphaDecay;

    return force > 0;
  }

  private get state(): GraphState<NodeData, LinkData> {
    return {
      areaTransform: this.areaTransform,
      cachedNodeText: this.cachedNodeText,
      context: this.context,
      eventAbortController: this.eventAbortController,
      highlightProgress: this.highlightProgress,
      highlightDrawing: this.highlightDrawing,
      highlightedNeighbors: this.highlightedNeighbors,
      highlightedNode: this.highlightedNode,
      highlightWorking: this.highlightWorking,
      isDragging: this.isDragging,
      simulation: this.simulation,
      simulationWorking: this.simulationWorking,
      height: this.height,
      links: this.links,
      nodes: this.nodes,
      width: this.width,
      forceSettings: this.forceSettings,
      graphSettings: this.graphSettings,
      linkSettings: this.linkSettings,
      nodeSettings: this.nodeSettings,
    };
  }

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
    // root.style.position = "relative";
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

  get dpi() {
    return devicePixelRatio;
  }

  getData(): Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> {
    return {
      links: this.links,
      nodes: this.nodes,
    };
  }

  changeData(
    options: Pick<Partial<GraphCanvasInterface<NodeData, LinkData>>, "links" | "nodes">,
    alpha?: number,
  ) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;
    if (options.nodes != undefined || options.links != undefined) this.updateData(alpha);
  }

  changeSettings(
    options: Omit<
      Partial<GraphCanvasInterface<NodeData, LinkData>>,
      "links" | "nodes" | "listeners"
    >,
  ) {
    if (options.graphSettings)
      this.graphSettings = graphSettingsGetter(options.graphSettings, this.graphSettings);
    if (options.forceSettings)
      this.forceSettings = forceSettingsGetter(options.forceSettings, this.forceSettings);
    if (options.linkSettings) this.linkSettings = linkSettingsGetter(options.linkSettings);
    if (options.nodeSettings) this.nodeSettings = nodeSettingsGetter(options.nodeSettings);

    if (options.forceSettings) return void this.updateSimulation();
    if (options.graphSettings) {
      this.draw = this.initDraw();
      this.initZoom(this.areaTransform);
    }

    this.tick();
  }

  tick() {
    if (!this.simulationWorking) this.draw();
  }

  restart(alpha?: number) {
    if (this.simulation) this.simulation.alpha(alpha ?? 1).restart();
  }

  start() {
    if (this.simulation) this.simulation.alpha(1).restart();
    if (this.container) this.container.style.display = "block";
  }

  stop() {
    if (this.simulation) this.simulation.stop();
    if (this.container) this.container.style.display = "none";
  }

  create() {
    this.init();
  }

  destroy() {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = undefined;
    }

    this.clearHTMLElements();
    this.clearState();
    this.clearDataDependencies();
  }

  private clearHTMLElements() {
    this.root.replaceChildren();
    this.area = undefined;
    this.context = undefined;
    this.container = undefined;
    this.eventAbortController.abort();
    this.eventAbortController = new AbortController();
  }

  private updateSimulation() {
    if (this.simulation) {
      this.initSimulationForces();
      this.simulation.alpha(1);
      this.simulation.restart();
    }
  }

  private clearState() {
    this.isDragging = false;
    this.highlightedNode = null;
    this.highlightedNeighbors = null;
    this.highlightProgress = 0;
    this.highlightWorking = false;
    this.highlightDrawing = false;
  }

  private clearDataDependencies() {
    this.cachedNodeText = {};
  }

  private updateData(alpha?: number) {
    this.clearDataDependencies();

    if (this.simulation) {
      this.initCollideForce();

      this.simulation
        .nodes(this.nodes)
        .force(
          "link",
          forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
            .id(this.nodeSettings.idGetter)
            .distance(this.forceSettings.linkDistance)
            .strength(this.forceSettings.linkStrength)
            .iterations(this.forceSettings.linkIterations),
        )
        .alpha(alpha ?? 0.5)
        .restart();
    }
  }

  private updateSize() {
    this.clearHTMLElements();

    this.initArea();
    this.initDnd();
    this.initZoom();
    this.initResize();
    this.initPointer();

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
          this.draw();
        })
        .on("end", () => {
          this.listeners.onSimulationEnd?.(this.state);

          if (this.graphSettings.showDrawTime) getDrawTime();
        });
      this.initSimulationForces();
    }
  }

  private initSimulationForces() {
    if (!this.simulation) return;

    const linkForce = this.simulation.force("link") as
      | ForceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>
      | undefined;

    if (!linkForce) return;

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
          this.forceSettings.centerPosition.x ?? 0,
          this.forceSettings.centerPosition.y ?? 0,
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
                this.state,
                this.forceSettings.collideRadius,
                undefined,
              );
            }
            const nodeOptions = nodeIterationExtractor(
              node,
              index,
              this.nodes,
              this.state,
              this.nodeSettings.options ?? {},
              nodeOptionsGetter,
            );
            const radius = nodeRadiusGetter({
              radiusFlexible: this.graphSettings.nodeRadiusFlexible,
              radiusInitial: nodeOptions.radius ?? this.graphSettings.nodeRadiusInitial,
              radiusCoefficient: this.graphSettings.nodeRadiusCoefficient,
              radiusFactor: this.graphSettings.nodeRadiusFactor,
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
    function calculateHighlightFading(this: GraphCanvas<NodeData, LinkData>) {
      this.highlightDrawing = true;

      if (!this.highlightWorking && this.highlightProgress > 0) {
        this.highlightProgress -= this.graphSettings.highlightDownStep;

        if (!this.simulationWorking) return void requestAnimationFrame(() => this.draw());

        return;
      }
      if (this.highlightWorking && this.highlightProgress < 1) {
        this.highlightProgress += this.graphSettings.highlightUpStep;

        if (!this.simulationWorking) return void requestAnimationFrame(() => this.draw());

        return;
      }
      if (!this.highlightWorking && this.highlightProgress <= 0) {
        if (this.highlightedNeighbors) this.highlightedNeighbors = null;
        if (this.highlightedNode) this.highlightedNode = null;
      }

      this.highlightDrawing = false;
    }

    function draw(this: GraphCanvas<NodeData, LinkData>) {
      if (!this.context) return;
      const state = this.state;

      if (this.listeners.onDraw) {
        this.listeners.onDraw(
          state,
          (status) => {
            this.highlightDrawing = status;
          },
          () => {
            if (this.highlightedNeighbors) this.highlightedNeighbors = null;
            if (this.highlightedNode) this.highlightedNode = null;
          },
        );

        return;
      }

      this.context.save();
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.translate(this.areaTransform.x, this.areaTransform.y);
      this.context.scale(this.areaTransform.k, this.areaTransform.k);

      /** links */
      this.links.forEach(getDrawLink(state).bind(this));

      /** nodes */
      const textRenders: (() => void)[] = [];
      this.nodes.forEach(getDrawNode(textRenders, state).bind(this));
      textRenders.forEach((render) => render());

      this.context.restore();

      this.listeners.onDrawFinished?.(state);

      calculateHighlightFading.bind(this)();
    }

    function getDrawLink(state: GraphState<NodeData, LinkData>) {
      return function drawLink(
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
          state,
          this.linkSettings.options ?? {},
          linkOptionsGetter,
        );

        if (linkOptions.drawLink) {
          linkOptions.drawLink(link, linkOptions, state);

          return;
        }

        let alpha = linkOptions.alpha;
        if (this.highlightedNeighbors && this.highlightedNode) {
          /** Not highlighted */
          if (
            this.highlightedNode.id != link.source.id &&
            this.highlightedNode.id != link.target.id
          ) {
            if (linkOptions.highlightFading) {
              alpha = animationByProgress(
                this.graphSettings.highlightLinkFadingMin,
                alpha - this.graphSettings.highlightLinkFadingMin,
                1 - this.highlightProgress,
              );
            }
          }
        }

        this.context.beginPath();

        this.context.globalAlpha = alpha;
        this.context.strokeStyle = linkOptions.color;
        this.context.lineWidth = linkOptions.width;

        if (linkOptions.pretty) {
          const { x1, x2, y1, y2 } = calculateLinkPositionByRadius(link) ?? {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          };

          this.context.moveTo(x1, y1);
          this.context.lineTo(x2, y2);
        } else {
          this.context.moveTo(link.source.x, link.source.y);
          this.context.lineTo(link.target.x, link.target.y);
        }

        this.context.stroke();

        if (linkOptions.drawExtraLink) {
          linkOptions.drawExtraLink(link, { ...linkOptions, alpha }, state);
        }
      };
    }

    function getDrawNode(textRenders: (() => void)[], state: GraphState<NodeData, LinkData>) {
      return function drawNode(
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        index: number,
      ) {
        if (!this.context || !node.x || !node.y) return;

        const nodeOptions = nodeIterationExtractor(
          node,
          index,
          this.nodes,
          state,
          this.nodeSettings.options ?? {},
          nodeOptionsGetter,
        );

        if (nodeOptions.nodeDraw) {
          nodeOptions.nodeDraw(node, nodeOptions, state);

          return;
        }

        let alpha = nodeOptions.alpha;
        let color = nodeOptions.color;
        let radiusInitial = nodeOptions.radius ?? this.graphSettings.nodeRadiusInitial;
        let textAlpha = nodeOptions.textAlpha;
        let textSize = nodeOptions.textSize;
        let textShiftX = nodeOptions.textShiftX;
        let textShiftY = nodeOptions.textShiftY;
        let textWeight = nodeOptions.textWeight;
        let textWidth = nodeOptions.textWidth;
        if (this.highlightedNeighbors && this.highlightedNode) {
          /** Not highlighted */
          if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
            if (nodeOptions.highlightFading) {
              alpha = animationByProgress(
                this.graphSettings.highlightFadingMin,
                alpha - this.graphSettings.highlightFadingMin,
                1 - this.highlightProgress,
              );
            }
            if (nodeOptions.highlightTextFading) {
              textAlpha = animationByProgress(
                this.graphSettings.highlightTextFadingMin,
                textAlpha - this.graphSettings.highlightTextFadingMin,
                1 - this.highlightProgress,
              );
            }
            if (nodeOptions.highlightColor) {
              const colorRgb = extractRgb(colorToRgb(color));
              if (colorRgb) {
                const colorRgbFade = fadeRgb(colorRgb, this.graphSettings.highlightColorFadingMin);
                const colorFadeAnimation = rgbAnimationByProgress(
                  colorRgb,
                  colorRgbFade,
                  this.highlightProgress,
                );
                color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
              }
            }
          } else if (
            !this.graphSettings.highlightOnlyRoot ||
            (this.graphSettings.highlightOnlyRoot && this.highlightedNode.id === node.id)
          ) {
            /** Highlighted */

            if (nodeOptions.highlightSizing) {
              radiusInitial = animationByProgress(
                radiusInitial,
                this.graphSettings.highlightSizingAdditional,
                this.highlightProgress,
              );
            }
            if (nodeOptions.highlightTextSizing) {
              textSize = animationByProgress(
                textSize,
                this.graphSettings.highlightTextSizingAdditional,
                this.highlightProgress,
              );
              textShiftX = animationByProgress(
                textShiftX,
                this.graphSettings.highlightTextShiftXAdditional,
                this.highlightProgress,
              );
              textShiftY = animationByProgress(
                textShiftY,
                this.graphSettings.highlightTextShiftYAdditional,
                this.highlightProgress,
              );
              textWeight = animationByProgress(
                textWeight,
                this.graphSettings.highlightTextWeightAdditional,
                this.highlightProgress,
              );
              textWidth = animationByProgress(
                textWidth,
                this.graphSettings.highlightTextWidthAdditional,
                this.highlightProgress,
              );
            }
          }
        }

        const radius = nodeRadiusGetter({
          radiusFlexible: this.graphSettings.nodeRadiusFlexible,
          radiusInitial,
          radiusCoefficient: this.graphSettings.nodeRadiusCoefficient,
          radiusFactor: this.graphSettings.nodeRadiusFactor,
          linkCount: node.linkCount,
        });

        node._radius = radius;

        this.context.beginPath();

        this.context.globalAlpha = alpha;

        /** text */
        if (nodeOptions.textVisible && nodeOptions.text) {
          textRenders.push(() => {
            if (nodeOptions.textDraw) {
              nodeOptions.textDraw(
                node,
                {
                  ...nodeOptions,
                  radius,
                  alpha,
                  color,
                  textAlpha,
                  textSize,
                  textShiftX,
                  textShiftY,
                  textWeight,
                  textWidth,
                },
                state,
              );

              return;
            }

            if (!this.context || !node.x || !node.y || !nodeOptions.text) return;
            this.context.beginPath();
            this.context.globalAlpha = textAlpha;

            drawText({
              id: node.id,
              cachedNodeText: this.cachedNodeText,
              context: this.context,
              text: nodeOptions.text,
              textAlign: nodeOptions.textAlign,
              textColor: nodeOptions.textColor,
              textFont: nodeOptions.textFont,
              textSize,
              x: node.x + textShiftX,
              y: node.y + radius + textShiftY,
              maxWidth: textWidth,
              textStyle: nodeOptions.textStyle,
              textWeight,
              textGap: nodeOptions.textGap,
            });

            if (nodeOptions.textExtraDraw) {
              nodeOptions.textExtraDraw(
                node,
                {
                  ...nodeOptions,
                  radius,
                  alpha,
                  color,
                  textAlpha,
                  textSize,
                  textShiftX,
                  textShiftY,
                  textWeight,
                  textWidth,
                },
                state,
              );
            }
          });
        }

        /** circle */
        this.context.lineWidth = nodeOptions.borderWidth;
        this.context.strokeStyle = nodeOptions.borderColor;
        this.context.fillStyle = color;
        this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

        this.context.fill();
        this.context.stroke();

        if (nodeOptions.nodeExtraDraw) {
          nodeOptions.nodeExtraDraw(
            node,
            {
              ...nodeOptions,
              radius,
              alpha,
              color,
              textAlpha,
              textSize,
              textShiftX,
              textShiftY,
              textWeight,
              textWidth,
            },
            state,
          );
        }
      };
    }

    if (this.graphSettings.showDrawTime) {
      return setDrawTime(draw.bind(this), this.graphSettings.showDrawTimeEveryTick);
    }

    return draw;
  }

  private initResize() {
    if (!this.area) throw new Error("bad init data");

    let initialResizeCall = true;

    const abortController = this.eventAbortController;
    const observer = new ResizeObserver(() => {
      if (initialResizeCall) {
        initialResizeCall = false;

        return;
      }

      if (abortController.signal.aborted) {
        observer.disconnect();

        return;
      }

      requestAnimationFrame(() => {
        this.updateSize();
      });
    });
    observer.observe(this.area);
  }

  private initPointer() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    /** hover */
    this.area.addEventListener(
      "pointermove",
      (event) => {
        let currentNode: NodeInterface<NodeData> | undefined;

        if (this.graphSettings.highlightByHover && !this.isDragging) {
          currentNode = nodeByPointerGetter({
            graphSettings: this.graphSettings,
            areaRect: this.areaRect,
            areaTransform: this.areaTransform,
            mouseEvent: event,
            nodes: this.nodes,
          });
          if (currentNode && this.highlightedNode !== currentNode) {
            this.highlightedNode = currentNode;
            this.highlightedNeighbors = new Set(this.highlightedNode?.neighbors ?? []);
            this.highlightWorking = true;

            if (!this.simulationWorking && !this.highlightDrawing)
              requestAnimationFrame(() => {
                this.draw();
              });
          } else if (!currentNode && this.highlightedNode) {
            this.highlightWorking = false;
            if (!this.simulationWorking && !this.highlightDrawing)
              requestAnimationFrame(() => {
                this.draw();
              });
          }
        }

        if (!this.listeners.onMove) return;

        if (!currentNode)
          currentNode = nodeByPointerGetter({
            graphSettings: this.graphSettings,
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

    /** dblclick */
    this.area.addEventListener("dblclick", (event) => {
      if (!this.listeners.onDoubleClick) return;

      const currentNode = nodeByPointerGetter({
        graphSettings: this.graphSettings,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });

      return void this.listeners.onDoubleClick(event, currentNode);
    });

    /** wheel click */
    this.area.addEventListener(
      "mousedown",
      (event) => {
        if (this.isDragging || !this.listeners.onWheelClick || event.button !== 1) return;
        const currentNode = nodeByPointerGetter({
          graphSettings: this.graphSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          nodes: this.nodes,
        });

        return void this.listeners.onWheelClick(event, currentNode);
      },
      {
        signal: this.eventAbortController.signal,
      },
    );

    /** click */
    this.area.addEventListener(
      "click",
      (event) => {
        if (this.isDragging || !this.listeners.onClick || event.button !== 0) return;
        const currentNode = nodeByPointerGetter({
          graphSettings: this.graphSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          nodes: this.nodes,
        });

        return void this.listeners.onClick(event, currentNode);
      },
      {
        signal: this.eventAbortController.signal,
      },
    );

    /** right click */
    this.area.addEventListener(
      "contextmenu",
      (event) => {
        if (!this.listeners.onContextMenu) return;

        const currentNode = nodeByPointerGetter({
          graphSettings: this.graphSettings,
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
        .subject((event: DragEventInterface<NodeData>) => {
          if (this.listeners.onDragSubject) {
            return this.listeners.onDragSubject(event, this.state);
          }

          if (!this.areaRect) return;

          const mouseEvent = event.sourceEvent as MouseEvent;
          const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);

          let index = 0;

          return greatest(this.nodes, (node) => {
            if (!node.x || !node.y || (isBoolean(node.drag) && !node.drag)) return undefined;

            let radius = node._radius;
            if (!radius) {
              const nodeOptions = nodeIterationExtractor(
                node,
                index,
                this.nodes,
                this.state,
                this.nodeSettings.options ?? {},
                nodeOptionsGetter,
              );

              radius = nodeRadiusGetter({
                radiusFlexible: this.graphSettings.nodeRadiusFlexible,
                radiusInitial: nodeOptions.radius ?? this.graphSettings.nodeRadiusInitial,
                radiusCoefficient: this.graphSettings.nodeRadiusCoefficient,
                radiusFactor: this.graphSettings.nodeRadiusFactor,
                linkCount: node.linkCount,
              });
            }

            index++;

            return this.graphSettings.dragPlaceCoefficient(node, pointerX, pointerY, radius);
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
          const mouseEvent = event.sourceEvent as MouseEvent;
          const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);
          event.subject.fx = pointerX;
          event.subject.fy = pointerY;

          this.listeners.onMoveDragFinished?.(event, this.state);
        })
        .on("end", (event: DragEventInterface<NodeData>) => {
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

          this.listeners.onEndDragFinished?.(event, this.state);
        }),
    );
  }

  private initZoom(currentZoom?: ZoomTransform) {
    if (!this.area) throw new Error("bad init data");

    const zoomInstance = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent(this.graphSettings.zoomExtent)
      .on("zoom", (event: ZoomEventInterface) => {
        this.listeners.onZoom?.(event);
        this.areaTransform = event.transform;

        if (!this.simulationWorking) requestAnimationFrame(() => this.draw());
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
}
