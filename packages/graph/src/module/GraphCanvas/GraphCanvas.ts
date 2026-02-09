import { isArray } from "@krainovsd/js-helpers";
import { forceLink } from "d3-force";
import { type ZoomTransform, zoomIdentity } from "d3-zoom";
import { GRAPH_CACHE_TYPE } from "./constants";
import {
  forceSettingsGetter,
  graphSettingsGetter,
  highlightSettingsGetter,
  linkSettingsGetter,
  listenersGetter,
  nodeSettingsGetter,
} from "./lib";
import {
  initArea,
  initCollideForce,
  initDnd,
  initDraw,
  initPointer,
  initResize,
  initSimulation,
  initSimulationForces,
  initZoom,
  updateLinkCache,
  updateNodeCache,
} from "./slices";
import type {
  CachedNodeTextInterface,
  ForceSettingsInterface,
  GraphCanvasCacheKeys,
  GraphCanvasInterface,
  GraphCanvasSimulation,
  GraphSettingsInterface,
  HighlightSettingsInterface,
  LinkInterface,
  LinkOptionsInterface,
  LinkParticle,
  LinkSettingsInterface,
  ListenersInterface,
  NodeInterface,
  NodeOptionsInterface,
  NodeSettingsInterface,
} from "./types";

export class GraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> {
  /** initial data */

  protected nodes: NodeInterface<NodeData>[];

  protected links: LinkInterface<NodeData, LinkData>[];

  protected particles: Record<string, LinkParticle[]> = {};

  protected width: number;

  protected height: number;

  protected root: HTMLElement;

  protected container: HTMLDivElement | undefined | null;

  protected area: HTMLCanvasElement | null | undefined;

  /** settings */

  protected graphSettings: Required<GraphSettingsInterface<NodeData>>;

  protected forceSettings: Required<ForceSettingsInterface<NodeData, LinkData>>;

  protected highlightSettings: Required<HighlightSettingsInterface>;

  protected nodeSettings: Required<Omit<NodeSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<NodeSettingsInterface<NodeData, LinkData>, "options">;

  protected linkSettings: Required<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> &
    Pick<LinkSettingsInterface<NodeData, LinkData>, "options">;

  protected listeners: ListenersInterface<NodeData, LinkData>;

  /** service */

  protected context: CanvasRenderingContext2D | null | undefined;

  protected simulation: GraphCanvasSimulation<NodeData, LinkData> | undefined;

  protected areaTransform: ZoomTransform = zoomIdentity;

  protected areaRect: DOMRect | undefined;

  protected draw: (this: GraphCanvas<NodeData, LinkData>, recursive?: boolean) => void;

  protected eventAbortController: AbortController;

  protected cachedNodeText: CachedNodeTextInterface = {};

  protected cachedNodeLabel: CachedNodeTextInterface = {};

  protected linkOptionsCache: Record<string, Required<LinkOptionsInterface<NodeData, LinkData>>> =
    {};

  protected nodeOptionsCache: Record<string, Required<NodeOptionsInterface<NodeData, LinkData>>> =
    {};

  protected isDragging: boolean = false;

  protected highlightedNode: NodeInterface<NodeData> | null = null;

  protected highlightedLink: LinkInterface<NodeData, LinkData> | null = null;

  protected highlightedNeighbors: Set<string | number> | null = null;

  protected highlightProgress: number = 1;

  protected highlightWorking: boolean = false;

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

    this.draw = initDraw.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initDraw>,
      ReturnType<typeof initDraw>
    >(this);

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
    alpha: number = 0.5,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
  ) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;
    if (options.nodes != undefined || options.links != undefined)
      this.updateData(alpha, clearCache);
  }

  changeSettings(
    options: Omit<
      Partial<GraphCanvasInterface<NodeData, LinkData>>,
      "links" | "nodes" | "listeners"
    >,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
  ) {
    if (options.graphSettings) {
      this.graphSettings = graphSettingsGetter(options.graphSettings, this.graphSettings);

      this.draw = initDraw.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initDraw>,
        ReturnType<typeof initDraw>
      >(this);
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
      return void this.updateSimulation();
    }

    this.tick();
  }

  updateRect() {
    if (!this.area) return;

    this.areaRect = this.area.getBoundingClientRect();
  }

  updateSize() {
    if (!this.area) return;

    const { width, height } = this.root.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.area.width = this.dpi * this.width;
    this.area.height = this.dpi * this.height;
    this.areaRect = this.area.getBoundingClientRect();

    this.context = this.area.getContext("2d");
    if (!this.context) throw new Error("couldn't create canvas context");
    this.context.scale(this.dpi, this.dpi);
    this.draw();
  }

  clearCache(keys: boolean | GraphCanvasCacheKeys[]) {
    if (keys === true) {
      updateNodeCache.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof updateNodeCache>,
        ReturnType<typeof updateNodeCache>
      >(this, true);
      updateLinkCache.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof updateLinkCache>,
        ReturnType<typeof updateLinkCache>
      >(this);
    } else if (isArray(keys)) {
      if (
        keys.some(
          (k) =>
            k === GRAPH_CACHE_TYPE.NodeText ||
            k === GRAPH_CACHE_TYPE.NodeLabel ||
            k === GRAPH_CACHE_TYPE.NodeOptions,
        )
      ) {
        updateNodeCache.call<
          GraphCanvas<NodeData, LinkData>,
          Parameters<typeof updateNodeCache>,
          ReturnType<typeof updateNodeCache>
        >(this, {
          label: keys.includes(GRAPH_CACHE_TYPE.NodeLabel),
          options: keys.includes(GRAPH_CACHE_TYPE.NodeOptions),
          text: keys.includes(GRAPH_CACHE_TYPE.NodeOptions),
        });
      }

      if (keys.includes(GRAPH_CACHE_TYPE.LinkOptions)) {
        updateLinkCache.call<
          GraphCanvas<NodeData, LinkData>,
          Parameters<typeof updateLinkCache>,
          ReturnType<typeof updateLinkCache>
        >(this);
      }
    }
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
    this.clearCache(true);
  }

  protected clearHTMLElements() {
    this.root.replaceChildren();
    this.area = undefined;
    this.context = undefined;
    this.container = undefined;
    this.eventAbortController.abort();
    this.eventAbortController = new AbortController();
  }

  protected updateSimulation() {
    if (this.simulation) {
      initSimulationForces.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initSimulationForces>,
        ReturnType<typeof initSimulationForces>
      >(this);
      this.simulation.alpha(1);
      this.simulation.restart();
    }
  }

  protected clearState() {
    this.isDragging = false;
    this.highlightedNode = null;
    this.highlightedLink = null;
    this.highlightedNeighbors = null;
    this.highlightProgress = 0;
    this.highlightWorking = false;
  }

  protected updateData(alpha: number = 0.5, clearCache: boolean | GraphCanvasCacheKeys[] = true) {
    if (clearCache) {
      this.clearCache(clearCache);
    }

    if (this.simulation) {
      initCollideForce.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initCollideForce>,
        ReturnType<typeof initCollideForce>
      >(this, false);

      this.simulation
        .nodes(this.nodes)
        .force(
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
        )
        .alpha(alpha)
        .restart();
    }
  }

  protected init() {
    initArea.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initArea>,
      ReturnType<typeof initArea>
    >(this);
    updateNodeCache.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this, true);
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
    initPointer.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initPointer>,
      ReturnType<typeof initPointer>
    >(this);
  }
}
