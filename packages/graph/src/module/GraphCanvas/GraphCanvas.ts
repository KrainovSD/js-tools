import { isArray } from "@krainovsd/js-helpers";
import { forceLink } from "d3-force";
import { select as d3Select } from "d3-selection";
import { ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import { GRAPH_CACHE_TYPE } from "./constants";
import {
  computeGraphBounds,
  extractLinkPointIds,
  forceSettingsGetter,
  graphSettingsGetter,
  highlightSettingsGetter,
  linkSettingsGetter,
  listenersGetter,
  nodeSettingsGetter,
} from "./lib";
import {
  exportToSvgSlice,
  initArea,
  initCollideForce,
  initDnd,
  initDraw,
  initPointer,
  initResize,
  initSelection,
  initSimulation,
  initSimulationForces,
  initZoom,
  updateLinkCache,
  updateNodeCache,
} from "./slices";
import type {
  ForceSettingsInterface,
  GraphCanvasCacheKeys,
  GraphCanvasInterface,
  GraphCanvasSimulation,
  GraphLinkSettingsInterface,
  GraphNodeSettingsInterface,
  GraphSettingsInterface,
  HighlightSettingsInterface,
  LinkInterface,
  LinkOptionsInterface,
  LinkParticle,
  ListenersInterface,
  NodeInterface,
  NodeOptionsInterface,
  PrecomputeForceSettingsInterface,
} from "./types";

export class GraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  /** initial data */

  protected nodes: NodeInterface<NodeData>[];

  protected links: LinkInterface<NodeData, LinkData>[];

  protected particles: (LinkParticle[] | undefined)[] = [];

  protected width: number;

  protected height: number;

  protected root: HTMLElement;

  protected container: HTMLDivElement | undefined | null;

  protected area: HTMLCanvasElement | null | undefined;

  /** settings */

  protected graphSettings: Required<GraphSettingsInterface<NodeData>>;

  protected forceSettings: Required<ForceSettingsInterface<NodeData, LinkData>>;

  protected highlightSettings: Required<HighlightSettingsInterface>;

  protected nodeSettings: GraphNodeSettingsInterface<NodeData, LinkData>;

  protected linkSettings: GraphLinkSettingsInterface<NodeData, LinkData>;

  protected listeners: ListenersInterface<NodeData, LinkData>;

  /** service */

  protected context: CanvasRenderingContext2D | null | undefined;

  protected simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;

  protected areaTransform: ZoomTransform = zoomIdentity;

  protected _translateExtent: [[number, number], [number, number]] | undefined;

  protected draw: (this: GraphCanvas<NodeData, LinkData>) => void;

  protected eventAbortController: AbortController;

  protected cachedNodeText: (string[] | undefined)[] = [];

  protected cachedNodeLabel: (string[] | undefined)[] = [];

  protected linkOptionsCache: (Required<LinkOptionsInterface<NodeData, LinkData>> | undefined)[] =
    [];

  protected nodeOptionsCache: (Required<NodeOptionsInterface<NodeData, LinkData>> | undefined)[] =
    [];

  protected isDragging: boolean = false;

  protected highlightedNode: NodeInterface<NodeData> | null = null;

  protected highlightedLink: LinkInterface<NodeData, LinkData> | null = null;

  protected highlightedNeighbors: Set<string | number> | null = null;

  protected highlightProgress: number = 1;

  protected highlightStart: number | null = null;

  protected highlightPositive: boolean = false;

  protected highlightController: AbortController | undefined;

  protected _lastNodeZoomK: number | undefined;

  protected _lastLinkZoomK: number | undefined;

  protected _zoomAnimating: boolean = false;

  protected isSelecting: boolean = false;

  protected selectionRect: { x1: number; y1: number; x2: number; y2: number } | null = null;

  protected areaRect: DOMRect | undefined;
  // protected get areaRect() {
  //   return this.area?.getBoundingClientRect();
  // }

  protected get simulationWorking() {
    const simulationAlpha = this.simulation?.alpha?.() ?? 0;
    const simulationAlphaMin = this.simulation?.alphaMin?.() ?? 0;
    const simulationAlphaDecay = this.simulation?.alphaDecay?.() ?? 0;
    const force = (simulationAlpha - simulationAlphaMin) / simulationAlphaDecay;

    return force > 0;
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
    highlightSettings,
  }: GraphCanvasInterface<NodeData, LinkData>) {
    // root.style.position = "relative";
    root.style.overflow = "hidden";

    this.root = root;

    this.forceSettings = forceSettingsGetter(forceSettings);
    this.linkSettings = linkSettingsGetter(linkSettings);
    this.nodeSettings = nodeSettingsGetter(nodeSettings);
    this.listeners = listenersGetter(listeners);
    this.graphSettings = graphSettingsGetter(graphSettings);
    this.highlightSettings = highlightSettingsGetter(highlightSettings);

    this.eventAbortController = new AbortController();

    this.nodes = nodes;
    this.links = links;
    this.height = 0;
    this.width = 0;

    this.draw = this._initSmartDraw();
  }

  _initSmartDraw = () => {
    const draw = initDraw.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initDraw>,
      ReturnType<typeof initDraw>
    >(this);
    const frameInterval = 1000 / this.graphSettings.maxFps;
    let debouncedDrawId: NodeJS.Timeout | undefined;
    let lastDraw = 0;

    return () => {
      if (debouncedDrawId != undefined) {
        clearTimeout(debouncedDrawId);
      }
      const elapsed = performance.now() - lastDraw;
      if (elapsed < frameInterval) {
        debouncedDrawId = setTimeout(() => {
          debouncedDrawId = undefined;
          this.tick();
        }, frameInterval * 2);
        return;
      }
      lastDraw = performance.now();
      draw();
    };
  };

  get dpi() {
    return devicePixelRatio;
  }

  getData = (): Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> => {
    return {
      links: this.links,
      nodes: this.nodes,
    };
  };

  fitToView = (
    margin: number = this.graphSettings.zoomToFitMargin,
    duration: number = this.graphSettings.zoomAnimationDuration,
  ) => {
    const area = this.area;
    if (!area) return;

    const bounds = computeGraphBounds(this.nodes);
    if (!bounds) return;

    const graphWidth = bounds.maxX - bounds.minX;
    const graphHeight = bounds.maxY - bounds.minY;
    if (graphWidth === 0 || graphHeight === 0) return;
    const graphCenterX = bounds.minX + graphWidth / 2;
    const graphCenterY = bounds.minY + graphHeight / 2;
    const scale = (1 - margin) / Math.max(graphWidth / this.width, graphHeight / this.height);

    const clampedScale = Math.min(scale, this.graphSettings.zoomExtent?.[1] ?? scale);
    const target = zoomIdentity
      .translate(this.width / 2, this.height / 2)
      .scale(clampedScale)
      .translate(-graphCenterX, -graphCenterY);
    if (!this.graphSettings.zoomAnimation) {
      this.areaTransform = target;
      zoom<HTMLCanvasElement, unknown>().transform(d3Select(area), target);
      this.clearCache(true);
      this.tick();
      return;
    }
    this.animateZoom(area, target, this.areaTransform, duration);
  };

  focusOnNode = (
    nodeId: string | number,
    scale: number = this.graphSettings.zoomToNodeScale,
    duration: number = this.graphSettings.zoomAnimationDuration,
  ) => {
    const area = this.area;
    if (!area) return;

    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    if (node.x == undefined || node.y == undefined) return;

    const target = zoomIdentity
      .translate(this.width / 2, this.height / 2)
      .scale(scale)
      .translate(-node.x, -node.y);
    if (!this.graphSettings.zoomAnimation) {
      this.areaTransform = target;
      zoom<HTMLCanvasElement, unknown>().transform(d3Select(area), target);
      this.clearCache(true);
      this.tick();
      return;
    }
    this.animateZoom(area, target, this.areaTransform, duration);
  };
  exportToSvg = (filename: string = "graph.svg", fit: boolean = false) => {
    exportToSvgSlice.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof exportToSvgSlice>,
      ReturnType<typeof exportToSvgSlice>
    >(this, filename, fit);
  };
  changeData = (
    options: Pick<Partial<GraphCanvasInterface<NodeData, LinkData>>, "links" | "nodes">,
    alpha: number = 0.5,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
    precompute: boolean = false,
  ) => {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;
    if (options.nodes != undefined || options.links != undefined) {
      this.updateData(alpha, clearCache, precompute);
    }
  };

  changeSettings = (
    options: Omit<
      Partial<GraphCanvasInterface<NodeData, LinkData>>,
      "links" | "nodes" | "listeners"
    >,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
    precompute: boolean = false,
  ) => {
    if (options.graphSettings) {
      this.graphSettings = graphSettingsGetter(options.graphSettings, this.graphSettings);

      this.draw = this._initSmartDraw();
      initZoom.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initZoom>,
        ReturnType<typeof initZoom>
      >(this, this.areaTransform);
    }
    if (options.forceSettings) {
      this.forceSettings = forceSettingsGetter(options.forceSettings, this.forceSettings);
    }
    if (options.highlightSettings) {
      this.highlightSettings = highlightSettingsGetter(
        options.highlightSettings,
        this.highlightSettings,
      );

      if (clearCache === true) {
        this.clearCache([
          GRAPH_CACHE_TYPE.NodeOptions,
          GRAPH_CACHE_TYPE.NodeText,
          GRAPH_CACHE_TYPE.NodeLabel,
          GRAPH_CACHE_TYPE.LinkOptions,
        ]);
      } else {
        this.clearCache(clearCache);
      }
    }
    if (options.linkSettings) {
      this.linkSettings = linkSettingsGetter(options.linkSettings, this.linkSettings);

      if (clearCache) {
        this.clearCache([GRAPH_CACHE_TYPE.LinkOptions]);
      } else {
        this.clearCache(clearCache);
      }
    }
    if (options.nodeSettings) {
      this.nodeSettings = nodeSettingsGetter(options.nodeSettings, this.nodeSettings);

      if (clearCache) {
        this.clearCache([
          GRAPH_CACHE_TYPE.NodeOptions,
          GRAPH_CACHE_TYPE.NodeText,
          GRAPH_CACHE_TYPE.NodeLabel,
        ]);
      } else {
        this.clearCache(clearCache);
      }

      initCollideForce.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initCollideForce>,
        ReturnType<typeof initCollideForce>
      >(this, true);
    }

    if (options.forceSettings) {
      return void this.updateSimulation(precompute);
    }

    this.tick();
  };

  updateRect = () => {
    if (!this.area) return;
    this.areaRect = this.area.getBoundingClientRect();
  };

  updateSize = () => {
    if (!this.area) return;

    const { width, height } = this.root.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.area.width = this.dpi * this.width;
    this.area.height = this.dpi * this.height;
    this.updateRect();
    this.context = this.area.getContext("2d");
    if (!this.context) throw new Error("couldn't create canvas context");
    this.context.scale(this.dpi, this.dpi);
    this.draw();
  };

  clearCache = (keys: boolean | GraphCanvasCacheKeys[]) => {
    if (keys === true) {
      this.nodeOptionsCache.length = 0;
      this.linkOptionsCache.length = 0;
      this.cachedNodeLabel.length = 0;
      this.cachedNodeText.length = 0;
    } else if (isArray(keys)) {
      for (const key of keys) {
        switch (key) {
          case GRAPH_CACHE_TYPE.NodeText: {
            this.cachedNodeText.length = 0;
            break;
          }
          case GRAPH_CACHE_TYPE.NodeLabel: {
            this.cachedNodeLabel.length = 0;
            break;
          }
          case GRAPH_CACHE_TYPE.NodeOptions: {
            this.nodeOptionsCache.length = 0;
            break;
          }
          case GRAPH_CACHE_TYPE.LinkOptions: {
            this.linkOptionsCache.length = 0;
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    updateNodeCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
  };

  tick = () => {
    if (!this.simulationWorking) this.draw();
  };

  restart = (alpha?: number, options?: Partial<PrecomputeForceSettingsInterface>) => {
    if (!this.simulation) return;

    const settings: Required<PrecomputeForceSettingsInterface> = {
      precompute: options?.precompute ?? this.forceSettings.precompute,
      precomputeMaxTimeMs: options?.precomputeMaxTimeMs ?? this.forceSettings?.precomputeMaxTimeMs,
      precomputeMaxTicks:
        options?.precomputeMaxTicks ?? this.forceSettings?.precomputeMaxTicks ?? 300,
      precomputeDisableForcesAfter:
        options?.precomputeDisableForcesAfter ??
        this.forceSettings?.precomputeDisableForcesAfter ??
        false,
    };
    if (!settings.precompute) {
      this.simulation.alpha(alpha ?? 1).restart();
      return;
    }
    if (settings.precomputeDisableForcesAfter) {
      this.forceSettings = forceSettingsGetter({ forces: true }, this.forceSettings);
    }
    initSimulationForces.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSimulationForces>,
      ReturnType<typeof initSimulationForces>
    >(this);
    this.simulation.stop();
    this.simulation.alpha(alpha ?? 1);

    const startTime = performance.now();
    let ticks = 0;
    while (
      performance.now() - startTime < settings.precomputeMaxTimeMs &&
      ticks < settings.precomputeMaxTicks
    ) {
      this.simulation.tick(1);
      ticks++;
      if (this.simulation.alpha() <= this.simulation.alphaMin()) break;
    }
    if (settings.precomputeDisableForcesAfter) {
      this.forceSettings = forceSettingsGetter({ forces: false }, this.forceSettings);
    }
    initSimulationForces.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSimulationForces>,
      ReturnType<typeof initSimulationForces>
    >(this);
    this.simulation.restart();
    this.tick();
  };

  create = () => {
    this.init();
  };

  destroy = () => {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = undefined;
    }
    this.clearHTMLElements();
    this.clearState();
    this.clearCache(true);
  };

  protected getPointerAreaPosition = (event: MouseEvent | TouchEvent) => {
    let localX: number;
    let localY: number;
    if ("offsetX" in event) {
      // localX = event.offsetX;
      // localY = event.offsetY;
      const rect = this.areaRect;
      if (!rect) return [0, 0];
      localX = event.clientX - rect.left;
      localY = event.clientY - rect.top;
    } else {
      const rect = this.areaRect;
      if (!rect) return [0, 0];
      const clientX = event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX;
      const clientY = event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY;
      localX = clientX - rect.left;
      localY = clientY - rect.top;
    }
    const px = (localX - this.areaTransform.x) / this.areaTransform.k;
    const py = (localY - this.areaTransform.y) / this.areaTransform.k;
    return [px, py];
  };

  protected clearHTMLElements = () => {
    this.root.replaceChildren();
    this.area = undefined;
    this.context = undefined;
    this.container = undefined;
    this.eventAbortController.abort();
    this.eventAbortController = new AbortController();
  };

  protected updateSimulation = (precompute: boolean = false) => {
    if (this.simulation) {
      initSimulationForces.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initSimulationForces>,
        ReturnType<typeof initSimulationForces>
      >(this);
      this.restart(1, { precompute });
    }
  };

  protected clearState = () => {
    this.isDragging = false;
    this.highlightedNode = null;
    this.highlightedLink = null;
    this.highlightedNeighbors = null;
    this.highlightProgress = 0;
    this.highlightStart = null;
    this.highlightPositive = false;
    this.isSelecting = false;
    this.selectionRect = null;
  };

  protected init = () => {
    initArea.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initArea>,
      ReturnType<typeof initArea>
    >(this);
    updateNodeCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
    initSimulation.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSimulation>,
      ReturnType<typeof initSimulation>
    >(this);
    this.restart(1);
    initDnd.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initDnd>,
      ReturnType<typeof initDnd>
    >(this);
    initZoom.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initZoom>,
      ReturnType<typeof initZoom>
    >(this);
    initResize.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initResize>,
      ReturnType<typeof initResize>
    >(this);
    initSelection.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSelection>,
      ReturnType<typeof initSelection>
    >(this);
    initPointer.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initPointer>,
      ReturnType<typeof initPointer>
    >(this);
    updateNodeCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
    this.tick();
  };

  protected updateData = (
    alpha: number = 0.5,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
    precompute: boolean = false,
  ) => {
    if (clearCache) {
      this.clearCache(clearCache);
    }

    if (this.simulation) {
      initCollideForce.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initCollideForce>,
        ReturnType<typeof initCollideForce>
      >(this, false);

      this.simulation.nodes(this.nodes).force(
        "link",
        forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
          .id(this.nodeSettings.idGetter.bind(this))
          .distance(
            this.forceSettings.forces && this.forceSettings.linkForce
              ? this.forceSettings.linkDistance
              : 0,
          )
          .strength(
            this.forceSettings.forces && this.forceSettings.linkForce
              ? this.forceSettings.linkStrength
              : 0,
          )
          .iterations(
            this.forceSettings.forces && this.forceSettings.linkForce
              ? this.forceSettings.linkIterations
              : 0,
          ),
      );
      this.restart(alpha, { precompute });
      initZoom.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initZoom>,
        ReturnType<typeof initZoom>
      >(this, this.areaTransform);
    }
  };

  protected animateHighlight = (
    node: NodeInterface<NodeData> | undefined,
    link: LinkInterface<NodeData, LinkData> | undefined,
    baseDuration: number = this.highlightSettings.highlightDuration,
  ) => {
    let positive = true;
    if (node && (this.highlightedNode !== node || !this.highlightPositive)) {
      this.highlightedNode = node;
      this.highlightedNeighbors = new Set(node.neighbors);
      this.particles = [];
      this.highlightedLink = null;
      this.highlightStart = performance.now();
    } else if (link && (this.highlightedLink !== link || !this.highlightPositive)) {
      const { sourceId, targetId } = extractLinkPointIds(link);
      this.highlightProgress = 0;
      this.highlightedLink = link;
      this.highlightedNeighbors = new Set([sourceId, targetId]);
      this.particles = [];
      this.highlightedNode = null;
      this.highlightStart = performance.now();
    } else if (!node && !link && this.highlightPositive) {
      positive = false;
    } else {
      return;
    }
    if (this.highlightController) {
      this.highlightController.abort();
    }
    const controller = new AbortController();
    this.highlightPositive = positive;
    this.highlightController = controller;
    const startTime = performance.now();
    const startProgress = this.highlightProgress;
    const targetProgress = positive ? 1 : 0;
    const delta = targetProgress - startProgress;
    const duration = baseDuration * Math.abs(delta);

    const animate = () => {
      if (controller.signal.aborted) return;
      const elapsed = performance.now() - startTime;
      const t = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
      const current = startProgress + delta * t;
      const eased =
        current < 0.5 ? 4 * current * current * current : 1 - (-2 * current + 2) ** 3 / 2;
      this.highlightProgress = eased;

      if (t < 1 || positive) {
        requestAnimationFrame(animate);
        this.draw();
      } else {
        this.highlightedNode = null;
        this.highlightedLink = null;
        this.highlightedNeighbors = null;
        this.highlightStart = null;
        this.particles = [];
        this.tick();
      }
    };
    requestAnimationFrame(animate);
  };

  protected animateZoom = (
    area: HTMLCanvasElement,
    target: ZoomTransform,
    start: ZoomTransform,
    duration: number,
  ) => {
    this._zoomAnimating = true;
    const startTime = performance.now();
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      const x = start.x + (target.x - start.x) * eased;
      const y = start.y + (target.y - start.y) * eased;
      const k = start.k + (target.k - start.k) * eased;

      this.areaTransform = new ZoomTransform(k, x, y);
      zoom<HTMLCanvasElement, unknown>().transform(d3Select(area), this.areaTransform);
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
      this.tick();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this._zoomAnimating = false;
        this.clearCache(true);
        this.tick();
      }
    };
    requestAnimationFrame(animate);
  };
}
