import { isArray, isBoolean, isObject } from "@krainovsd/js-helpers";
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
  checkType,
  colorToRgb,
  extractRgb,
  fadeRgb,
  getDrawTime,
  resetDrawTime,
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
  getParticlePosition,
  graphSettingsGetter,
  isNodeVisible,
  linkByPointerGetter,
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
  GraphParticle,
  GraphSettingsInterface,
  GraphState,
  LinkOptionsInterface,
  LinkSettingsInterface,
  ListenersInterface,
  NodeOptionsInterface,
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

  private particles: Record<string, GraphParticle[]> = {};

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

  private linkOptionsCache: Record<string, Required<LinkOptionsInterface<NodeData, LinkData>>> = {};

  private nodeOptionsCache: Record<string, Required<NodeOptionsInterface<NodeData, LinkData>>> = {};

  private isDragging: boolean = false;

  private highlightedNode: NodeInterface<NodeData> | null = null;

  private highlightedLink: LinkInterface<NodeData, LinkData> | null = null;

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
      highlightedLink: this.highlightedLink,
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
    if (options.graphSettings) {
      this.graphSettings = graphSettingsGetter(options.graphSettings, this.graphSettings);
      this.draw = this.initDraw();
      this.initZoom(this.areaTransform);
    }
    if (options.forceSettings) {
      this.forceSettings = forceSettingsGetter(options.forceSettings, this.forceSettings);
    }
    if (options.linkSettings) {
      this.linkSettings = linkSettingsGetter(options.linkSettings, this.linkSettings);
      this.linkOptionsCache = {};
    }
    if (options.nodeSettings) {
      this.nodeSettings = nodeSettingsGetter(options.nodeSettings, this.nodeSettings);
      this.cachedNodeText = {};
      this.nodeOptionsCache = {};
    }

    if (options.forceSettings) {
      return void this.updateSimulation();
    }

    this.tick();
  }

  updateRect() {
    if (this.area) this.areaRect = this.area.getBoundingClientRect();
  }

  clearCache() {
    this.nodeOptionsCache = {};
    this.linkOptionsCache = {};
    this.cachedNodeText = {};
  }

  tick() {
    if (!this.simulationWorking && !this.highlightWorking) this.draw();
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
    this.highlightedLink = null;
    this.highlightedNeighbors = null;
    this.highlightProgress = 0;
    this.highlightWorking = false;
    this.highlightDrawing = false;
  }

  private clearDataDependencies() {
    this.cachedNodeText = {};
    this.nodeOptionsCache = {};
    this.linkOptionsCache = {};
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

    if (!this.simulationWorking && !this.highlightWorking) this.draw();
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

          if (this.graphSettings.showDrawTime) {
            getDrawTime();
            // eslint-disable-next-line no-console
            console.log(`nodes: ${this.nodes.length} | links: ${this.links.length}`);
            resetDrawTime();
          }
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

    this.initCollideForce(true);
  }

  private initCollideForce(forceUpdate?: boolean) {
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
    if (isMaxCollideNodes && isMaxCollideLinks) {
      this.simulation.force("collide", null);
    } else if (!this.simulation.force("collide") || forceUpdate) {
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
              radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
              radiusInitial: nodeOptions.radius ?? this.nodeSettings.nodeRadiusInitial,
              radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
              radiusFactor: this.nodeSettings.nodeRadiusFactor,
              linkCount: node.linkCount,
            });

            return radius + this.forceSettings.collideAdditionalRadius;
          })
          .strength(this.forceSettings.collideStrength)
          .iterations(this.forceSettings.collideIterations),
      );
    }
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
        const highlightDownStep = 1 / this.graphSettings.highlightDownFrames;
        this.highlightProgress -= highlightDownStep;

        if (!this.simulationWorking) return void requestAnimationFrame(() => this.draw());

        if (!this.linkSettings.particles) return;
      }
      if (this.highlightWorking && this.highlightProgress < 1) {
        const highlightUpStep = 1 / this.graphSettings.highlightUpFrames;
        this.highlightProgress += highlightUpStep;

        if (!this.simulationWorking) return void requestAnimationFrame(() => this.draw());

        if (!this.linkSettings.particles) return;
      }

      if (this.linkSettings.particles && this.highlightWorking && !this.simulationWorking) {
        return void requestAnimationFrame(() => this.draw());
      }

      if (!this.highlightWorking && this.highlightProgress <= 0) {
        if (this.highlightedNeighbors || this.highlightedNode || this.highlightedLink) {
          this.highlightedNeighbors = null;
          this.highlightedNode = null;
          this.highlightedLink = null;
          this.particles = {};

          if (!this.simulationWorking) return void requestAnimationFrame(() => this.draw());
        }
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
            if (this.highlightedLink) this.highlightedLink = null;
          },
        );

        return;
      }

      this.context.save();
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.translate(this.areaTransform.x, this.areaTransform.y);
      this.context.scale(this.areaTransform.k, this.areaTransform.k);

      const textRenders: (() => void)[] = [];
      const nodeRenders: (() => void)[] = [];
      this.nodes.forEach(getDrawNode(nodeRenders, textRenders, state).bind(this));

      /** links */
      this.links.forEach(getDrawLink(state).bind(this));

      /** nodes */

      nodeRenders.forEach((render) => render());
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

        if (!link.source._visible && !link.target._visible) return;

        const id = `${link.target.id}${link.source.id}`;
        let linkOptions: Required<LinkOptionsInterface<NodeData, LinkData>>;
        if (this.linkSettings.cache && this.linkOptionsCache[id]) {
          linkOptions = this.linkOptionsCache[id];
        } else {
          linkOptions = linkIterationExtractor(
            link,
            index,
            this.links,
            state,
            this.linkSettings.options ?? {},
            linkOptionsGetter,
          );
          if (this.linkSettings.cache) {
            this.linkOptionsCache[id] = linkOptions;
          }
        }

        if (linkOptions.drawLink) {
          linkOptions.drawLink(link, linkOptions, state);

          return;
        }

        let alpha = linkOptions.alpha;
        let arrowAlpha = this.linkSettings.arrowByHighlight ? 0 : linkOptions.arrowAlpha;

        /** NODE HIGHLIGHT */
        if (this.highlightedNeighbors && this.highlightedNode) {
          /** Not highlighted */
          if (
            this.highlightedNode.id != link.source.id &&
            this.highlightedNode.id != link.target.id
          ) {
            if (this.linkSettings.highlightByNodeLinkFading) {
              const min =
                this.linkSettings.highlightByNodeLinkFadingMin < alpha
                  ? this.linkSettings.highlightByNodeLinkFadingMin
                  : alpha;
              alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
            }
            if (
              this.linkSettings.arrow &&
              this.linkSettings.highlightByNodeArrowFading &&
              !this.linkSettings.arrowByHighlight
            ) {
              const min =
                this.linkSettings.highlightByNodeArrowFadingMin < arrowAlpha
                  ? this.linkSettings.highlightByNodeArrowFadingMin
                  : arrowAlpha;
              arrowAlpha = animationByProgress(min, arrowAlpha - min, 1 - this.highlightProgress);
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (this.linkSettings.arrow && this.linkSettings.arrowByHighlight) {
              /** Highlighted */
              arrowAlpha = animationByProgress(0, linkOptions.arrowAlpha, this.highlightProgress);
            }
          }
        }
        /** LINK HIGHLIGHT */
        if (this.highlightedNeighbors && this.highlightedLink) {
          /** Not highlighted */
          if (this.highlightedLink !== link) {
            if (this.linkSettings.highlightByLinkLinkFading) {
              const min =
                this.linkSettings.highlightByLinkLinkFadingMin < alpha
                  ? this.linkSettings.highlightByLinkLinkFadingMin
                  : alpha;
              alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
            }
            if (
              this.linkSettings.arrow &&
              this.linkSettings.highlightByLinkArrowFading &&
              !this.linkSettings.arrowByHighlight
            ) {
              const min =
                this.linkSettings.highlightByLinkArrowFadingMin < arrowAlpha
                  ? this.linkSettings.highlightByLinkArrowFadingMin
                  : arrowAlpha;
              arrowAlpha = animationByProgress(min, arrowAlpha - min, 1 - this.highlightProgress);
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (this.linkSettings.arrow && this.linkSettings.arrowByHighlight) {
              /** Highlighted */
              arrowAlpha = animationByProgress(0, linkOptions.arrowAlpha, this.highlightProgress);
            }
          }
        }

        /** Link */
        this.context.beginPath();

        this.context.globalAlpha = alpha;
        this.context.strokeStyle = linkOptions.color;
        this.context.lineWidth = linkOptions.width;

        let xStart = link.source.x;
        let yStart = link.source.y;
        let xEnd = link.target.x;
        let yEnd = link.target.y;
        if (this.linkSettings.pretty) {
          const isHasArrow = this.linkSettings.arrow && arrowAlpha > 0;

          const { x1, x2, y1, y2 } = calculateLinkPositionByRadius(
            link,
            isHasArrow ? linkOptions.arrowSize : 0,
          ) ?? {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          };

          xStart = x1;
          xEnd = x2;
          yStart = y1;
          yEnd = y2;
        }

        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.stroke();

        /** Particle */
        if (
          this.linkSettings.particles &&
          ((this.highlightedNode &&
            (this.highlightedNode.id === link.source.id ||
              this.highlightedNode.id === link.target.id)) ||
            (this.highlightedLink && this.highlightedLink === link))
        ) {
          if (!this.particles[id]) {
            const sourceId = link.source.id;
            const targetId = link.target.id;
            this.particles[id] = Array.from({ length: linkOptions.particleCount }, (_, index) => {
              return {
                step: 0,
                wait: index * (linkOptions.particleSteps / linkOptions.particleCount),
                sourceId,
                targetId,
              };
            }) as GraphParticle[];
          }
          this.particles[id].forEach((particle) => {
            if (!this.context) return;

            getParticlePosition({
              particle,
              totalSteps: linkOptions.particleSteps,
              xEnd,
              xStart,
              yEnd,
              yStart,
            });
            if (particle.x != undefined && particle.y != undefined) {
              this.context.beginPath();
              this.context.arc(particle.x, particle.y, linkOptions.particleRadius, 0, Math.PI * 2);
              this.context.fillStyle = linkOptions.particleColor;
              this.context.fill();
              this.context.stroke();
            }
          });
        }

        /** Arrow */
        if (this.linkSettings.arrow && arrowAlpha > 0) {
          const {
            x1: xStart,
            x2: xEnd,
            y1: yStart,
            y2: yEnd,
          } = calculateLinkPositionByRadius(link) ?? {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          };

          const angle = Math.atan2(yEnd - yStart, xEnd - xStart);
          this.context.beginPath();
          this.context.globalAlpha = arrowAlpha;
          this.context.moveTo(xEnd, yEnd);
          this.context.lineTo(
            xEnd - linkOptions.arrowSize * Math.cos(angle - Math.PI / 6),
            yEnd - linkOptions.arrowSize * Math.sin(angle - Math.PI / 6),
          );
          this.context.lineTo(
            xEnd - linkOptions.arrowSize * Math.cos(angle + Math.PI / 6),
            yEnd - linkOptions.arrowSize * Math.sin(angle + Math.PI / 6),
          );
          this.context.closePath();
          this.context.fillStyle = linkOptions.arrowColor;
          this.context.fill();
          this.context.stroke();
        }

        if (linkOptions.drawExtraLink) {
          linkOptions.drawExtraLink(link, { ...linkOptions, alpha }, state);
        }
      };
    }

    function getDrawNode(
      nodeRenders: (() => void)[],
      textRenders: (() => void)[],
      state: GraphState<NodeData, LinkData>,
    ) {
      return function drawNode(
        this: GraphCanvas<NodeData, LinkData>,
        node: NodeInterface<NodeData>,
        index: number,
      ) {
        if (!this.context || !node.x || !node.y) return;

        let nodeOptions: Required<NodeOptionsInterface<NodeData, LinkData>>;
        if (this.nodeSettings.cache && this.nodeOptionsCache[node.id]) {
          nodeOptions = this.nodeOptionsCache[node.id];
        } else {
          nodeOptions = nodeIterationExtractor(
            node,
            index,
            this.nodes,
            state,
            this.nodeSettings.options ?? {},
            nodeOptionsGetter,
          );
          if (this.nodeSettings.cache) {
            this.nodeOptionsCache[node.id] = nodeOptions;
          }
        }

        if (nodeOptions.nodeDraw && nodeOptions.textDraw) {
          nodeRenders.push(() => {
            nodeOptions?.nodeDraw?.(node, nodeOptions, state);
          });

          textRenders.push(() => {
            nodeOptions?.textDraw?.(node, nodeOptions, state);
          });

          return;
        }

        let alpha = nodeOptions.alpha;
        let color = nodeOptions.color;
        let radiusInitial = nodeOptions.radius ?? this.nodeSettings.nodeRadiusInitial;
        let textAlpha = nodeOptions.textAlpha;
        let textSize = nodeOptions.textSize;
        let textShiftX = nodeOptions.textShiftX;
        let textShiftY = nodeOptions.textShiftY;
        let textWeight = nodeOptions.textWeight;
        let textWidth = nodeOptions.textWidth;
        /** Node Highlight */
        if (this.highlightedNeighbors && this.highlightedNode) {
          /** Not highlighted */
          if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
            if (this.nodeSettings.highlightByNodeNodeFading) {
              const min =
                this.nodeSettings.highlightByNodeNodeFadingMin < alpha
                  ? this.nodeSettings.highlightByNodeNodeFadingMin
                  : alpha;
              alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
            }
            if (this.nodeSettings.highlightByNodeTextFading) {
              const min =
                this.nodeSettings.highlightByNodeTextFadingMin < textAlpha
                  ? this.nodeSettings.highlightByNodeTextFadingMin
                  : textAlpha;
              textAlpha = animationByProgress(min, textAlpha - min, 1 - this.highlightProgress);
            }
            if (this.nodeSettings.highlightByNodeNodeColor) {
              const colorRgb = extractRgb(colorToRgb(color));
              if (colorRgb) {
                const colorRgbFade = fadeRgb(
                  colorRgb,
                  this.nodeSettings.highlightByNodeNodeColorFadingMin,
                );
                const colorFadeAnimation = rgbAnimationByProgress(
                  colorRgb,
                  colorRgbFade,
                  this.highlightProgress,
                );
                color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
              }
            }
          } else if (
            !this.nodeSettings.highlightByNodeOnlyRoot ||
            (this.nodeSettings.highlightByNodeOnlyRoot && this.highlightedNode.id === node.id)
          ) {
            /** Highlighted */

            if (this.nodeSettings.highlightByNodeNodeSizing) {
              radiusInitial = animationByProgress(
                radiusInitial,
                this.nodeSettings.highlightByNodeNodeSizingAdditional,
                this.highlightProgress,
              );
            }
            if (this.nodeSettings.highlightByNodeTextSizing) {
              textSize = animationByProgress(
                textSize,
                this.nodeSettings.highlightByNodeTextSizingAdditional,
                this.highlightProgress,
              );
              textShiftX = animationByProgress(
                textShiftX,
                this.nodeSettings.highlightByNodeTextShiftXAdditional,
                this.highlightProgress,
              );
              textShiftY = animationByProgress(
                textShiftY,
                this.nodeSettings.highlightByNodeTextShiftYAdditional,
                this.highlightProgress,
              );
              textWeight = animationByProgress(
                textWeight,
                this.nodeSettings.highlightByNodeTextWeightAdditional,
                this.highlightProgress,
              );
              textWidth = animationByProgress(
                textWidth,
                this.nodeSettings.highlightByNodeTextWidthAdditional,
                this.highlightProgress,
              );
            }
          }
        }
        /** LinkHighlight */
        if (this.highlightedNeighbors && this.highlightedLink) {
          /** Not highlighted */
          if (
            !this.highlightedNeighbors.has(node.id) &&
            this.highlightedLink.source !== node &&
            this.highlightedLink.target !== node
          ) {
            if (this.nodeSettings.highlightByLinkNodeFading) {
              const min =
                this.nodeSettings.highlightByLinkNodeFadingMin < alpha
                  ? this.nodeSettings.highlightByLinkNodeFadingMin
                  : alpha;
              alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
            }
            if (this.nodeSettings.highlightByLinkTextFading) {
              const min =
                this.nodeSettings.highlightByLinkTextFadingMin < textAlpha
                  ? this.nodeSettings.highlightByLinkTextFadingMin
                  : textAlpha;
              textAlpha = animationByProgress(min, textAlpha - min, 1 - this.highlightProgress);
            }
            if (this.nodeSettings.highlightByLinkNodeColor) {
              const colorRgb = extractRgb(colorToRgb(color));
              if (colorRgb) {
                const colorRgbFade = fadeRgb(
                  colorRgb,
                  this.nodeSettings.highlightByLinkNodeColorFadingMin,
                );
                const colorFadeAnimation = rgbAnimationByProgress(
                  colorRgb,
                  colorRgbFade,
                  this.highlightProgress,
                );
                color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
              }
            }
          } else {
            /** Highlighted */

            if (this.nodeSettings.highlightByLinkNodeSizing) {
              radiusInitial = animationByProgress(
                radiusInitial,
                this.nodeSettings.highlightByLinkNodeSizingAdditional,
                this.highlightProgress,
              );
            }
            if (this.nodeSettings.highlightByLinkTextSizing) {
              textSize = animationByProgress(
                textSize,
                this.nodeSettings.highlightByLinkTextSizingAdditional,
                this.highlightProgress,
              );
              textShiftX = animationByProgress(
                textShiftX,
                this.nodeSettings.highlightByLinkTextShiftXAdditional,
                this.highlightProgress,
              );
              textShiftY = animationByProgress(
                textShiftY,
                this.nodeSettings.highlightByLinkTextShiftYAdditional,
                this.highlightProgress,
              );
              textWeight = animationByProgress(
                textWeight,
                this.nodeSettings.highlightByLinkTextWeightAdditional,
                this.highlightProgress,
              );
              textWidth = animationByProgress(
                textWidth,
                this.nodeSettings.highlightByLinkTextWidthAdditional,
                this.highlightProgress,
              );
            }
          }
        }

        const radius = nodeRadiusGetter({
          radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
          radiusInitial,
          radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
          radiusFactor: this.nodeSettings.nodeRadiusFactor,
          linkCount: node.linkCount,
        });

        node._radius = radius;
        if (
          !isNodeVisible({
            height: this.height,
            width: this.width,
            x: node.x,
            y: node.y,
            radius,
            transform: this.areaTransform,
          })
        ) {
          node._visible = false;

          return;
        }
        node._visible = true;

        nodeRenders.push(() => {
          if (!this.context || !node.x || !node.y) return;

          this.context.beginPath();

          this.context.globalAlpha = alpha;

          /** circle */
          this.context.lineWidth = nodeOptions.borderWidth;
          this.context.strokeStyle = nodeOptions.borderColor;
          this.context.fillStyle = color;
          this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

          this.context.fill();
          this.context.stroke();
        });

        if (nodeOptions.nodeExtraDraw) {
          nodeRenders.push(() => {
            nodeOptions?.nodeExtraDraw?.(
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
          });
        }

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

    document.addEventListener("scroll", this.updateRect.bind(this), {
      capture: true,
      passive: true,
      signal: abortController.signal,
    });

    observer.observe(this.area);
  }

  private initPointer() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    function onHover(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
      if (!this.area) return;

      let currentNode: NodeInterface<NodeData> | undefined;
      let currentLink: LinkInterface<NodeData, LinkData> | undefined;
      const checkHighlightNode = this.nodeSettings.highlightByHoverNode && !this.isDragging;
      const checkHighlightLink = this.linkSettings.highlightByHoverLink && !this.isDragging;

      if (checkHighlightNode) {
        currentNode = nodeByPointerGetter({
          nodeSettings: this.nodeSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          nodes: this.nodes,
        });
      }
      if (currentNode) {
        this.area.style.cursor = "pointer";
      } else if (checkHighlightLink) {
        currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });

        if (currentLink) {
          this.area.style.cursor = "pointer";
        } else {
          this.area.style.cursor = "default";
        }
      } else {
        this.area.style.cursor = "default";
      }
      if (currentNode && this.highlightedNode !== currentNode) {
        this.highlightedNode = currentNode;
        this.highlightedLink = null;
        this.highlightedNeighbors = new Set(this.highlightedNode?.neighbors ?? []);
        this.highlightWorking = true;

        if (!this.simulationWorking && !this.highlightDrawing)
          requestAnimationFrame(() => {
            this.draw();
          });
      } else if (
        currentLink &&
        checkType<NodeInterface<NodeData>>(currentLink.source, isObject(currentLink.source)) &&
        checkType<NodeInterface<NodeData>>(currentLink.target, isObject(currentLink.target)) &&
        this.highlightedLink !== currentLink
      ) {
        this.highlightedLink = currentLink;
        this.highlightedNode = null;
        this.highlightedNeighbors = new Set([currentLink.source.id, currentLink.target.id]);
        this.highlightWorking = true;

        if (!this.simulationWorking && !this.highlightDrawing)
          requestAnimationFrame(() => {
            this.draw();
          });
      } else if (!currentNode && !currentLink && (this.highlightedNode || this.highlightedLink)) {
        this.highlightWorking = false;
        if (!this.simulationWorking && !this.highlightDrawing)
          requestAnimationFrame(() => {
            this.draw();
          });
      }

      if (!this.listeners.onMove) return;

      if (!currentNode && !checkHighlightNode)
        currentNode = nodeByPointerGetter({
          nodeSettings: this.nodeSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          nodes: this.nodes,
        });
      if (!currentNode && (!checkHighlightNode || (!checkHighlightLink && !currentLink))) {
        currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });
      }

      if (!currentNode) return void this.listeners.onMove(event, currentNode, currentLink);
    }
    function onWheelClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
      if (
        this.isDragging ||
        !this.listeners.onWheelClick ||
        !("button" in event) ||
        event.button !== 1
      )
        return;

      const currentNode = nodeByPointerGetter({
        nodeSettings: this.nodeSettings,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });

      if (!currentNode) {
        const currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });

        return void this.listeners.onWheelClick(event, undefined, currentLink);
      }

      return void this.listeners.onWheelClick(event, currentNode, undefined);
    }
    function onRightClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent) {
      if (!this.listeners.onContextMenu) return;

      const currentNode = nodeByPointerGetter({
        nodeSettings: this.nodeSettings,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });

      if (!currentNode) {
        const currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });

        return void this.listeners.onContextMenu(event, undefined, currentLink);
      }

      return void this.listeners.onContextMenu(event, currentNode, undefined);
    }
    function onDoubleClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
      if (!this.listeners.onDoubleClick) return;

      const currentNode = nodeByPointerGetter({
        nodeSettings: this.nodeSettings,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });
      if (!currentNode) {
        const currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });

        return void this.listeners.onDoubleClick(event, undefined, currentLink);
      }

      return void this.listeners.onDoubleClick(event, currentNode, undefined);
    }
    function onClick(this: GraphCanvas<NodeData, LinkData>, event: MouseEvent | TouchEvent) {
      if (this.isDragging || !this.listeners.onClick || ("button" in event && event.button !== 0))
        return;
      const currentNode = nodeByPointerGetter({
        nodeSettings: this.nodeSettings,
        areaRect: this.areaRect,
        areaTransform: this.areaTransform,
        mouseEvent: event,
        nodes: this.nodes,
      });
      if (!currentNode) {
        const currentLink = linkByPointerGetter({
          linkSettings: this.linkSettings,
          areaRect: this.areaRect,
          areaTransform: this.areaTransform,
          mouseEvent: event,
          links: this.links,
        });

        return void this.listeners.onClick(event, undefined, currentLink);
      }

      return void this.listeners.onClick(event, currentNode, undefined);
    }

    /** hover */
    this.area.addEventListener("mousemove", onHover.bind(this), {
      signal: this.eventAbortController.signal,
    });
    this.area.addEventListener("touchmove", onHover.bind(this), {
      signal: this.eventAbortController.signal,
    });

    /** dblclick */
    this.area.addEventListener("dblclick", onDoubleClick.bind(this), {
      signal: this.eventAbortController.signal,
    });

    /** wheel click */
    this.area.addEventListener("mousedown", onWheelClick.bind(this), {
      signal: this.eventAbortController.signal,
    });

    /** click */
    this.area.addEventListener("click", onClick.bind(this), {
      signal: this.eventAbortController.signal,
    });

    /** right click */
    this.area.addEventListener("contextmenu", onRightClick.bind(this), {
      signal: this.eventAbortController.signal,
    });
  }

  private initDnd() {
    if (!this.area || !this.nodes || !this.simulation) throw new Error("bad init data");

    const dragHandler = d3Drag<HTMLCanvasElement, unknown>()
      .subject((event: DragEventInterface<NodeData>) => {
        if (this.listeners.onDragSubject) {
          return this.listeners.onDragSubject(event, this.state);
        }

        if (!this.areaRect) return;

        const mouseEvent = event.sourceEvent as MouseEvent | TouchEvent;
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
              radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
              radiusInitial: nodeOptions.radius ?? this.nodeSettings.nodeRadiusInitial,
              radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
              radiusFactor: this.nodeSettings.nodeRadiusFactor,
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
        const mouseEvent = event.sourceEvent as MouseEvent | TouchEvent;
        const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);
        event.subject.fx = pointerX;
        event.subject.fy = pointerY;

        this.listeners.onMoveDragFinished?.(event, this.state);
      })
      .on("end", (event: DragEventInterface<NodeData>) => {
        this.isDragging = false;

        if (!event.active && this.simulation) this.simulation.alphaTarget(0);

        if (this.nodeSettings.stickAfterDrag && this.areaRect) {
          if (!this.areaRect) return;
          const mouseEvent = event.sourceEvent as MouseEvent | TouchEvent;
          const [pointerX, pointerY] = pointerGetter(mouseEvent, this.areaRect, this.areaTransform);
          event.subject.fx = pointerX;
          event.subject.fy = pointerY;
        } else {
          event.subject.fx = null;
          event.subject.fy = null;
        }

        this.listeners.onEndDragFinished?.(event, this.state);
      });

    d3Select(this.area).call(dragHandler);
  }

  private initZoom(currentZoom?: ZoomTransform) {
    if (!this.area) throw new Error("bad init data");

    const zoomInstance = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent(this.graphSettings.zoomExtent)
      .on("zoom", (event: ZoomEventInterface) => {
        this.listeners.onZoom?.(event);
        this.areaTransform = event.transform;
        this.linkOptionsCache = {};
        this.nodeOptionsCache = {};

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
}
