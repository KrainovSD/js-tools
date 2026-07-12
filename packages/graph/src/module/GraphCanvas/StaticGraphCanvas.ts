import { GraphCanvas } from "./GraphCanvas";
import { GRAPH_CACHE_TYPE } from "./constants";
import {
  graphSettingsGetter,
  highlightSettingsGetter,
  linkSettingsGetter,
  nodeSettingsGetter,
} from "./lib";
import {
  initArea,
  initDnd,
  initDraw,
  initPointer,
  initResize,
  initSelection,
  initZoom,
  updateLinkCache,
  updateNodeCache,
} from "./slices";
import type { GraphCanvasCacheKeys, GraphCanvasInterface } from "./types";

export class StaticGraphCanvas<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> extends GraphCanvas<NodeData, LinkData> {
  protected override get simulationWorking() {
    return false;
  }

  protected _rafTickId: number | undefined;

  protected override init = () => {
    initArea.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initArea>,
      ReturnType<typeof initArea>
    >(this);
    updateNodeCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
    initDnd.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initDnd>,
      ReturnType<typeof initDnd>
    >(this, true);
    initZoom.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initZoom>,
      ReturnType<typeof initZoom>
    >(this);
    initResize.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initResize>,
      ReturnType<typeof initResize>
    >(this);
    initSelection.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSelection>,
      ReturnType<typeof initSelection>
    >(this);
    initPointer.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initPointer>,
      ReturnType<typeof initPointer>
    >(this);
    updateNodeCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
    this.fitToView();
    this.tick();
  };

  override tick = () => {
    if (this._rafTickId != undefined) return;
    this._rafTickId = requestAnimationFrame(() => {
      this._rafTickId = undefined;
      this.draw();
    });
  };

  override restart = () => {};

  override changeData = (
    options: Pick<Partial<GraphCanvasInterface<NodeData, LinkData>>, "links" | "nodes">,
    _alpha?: number,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
  ) => {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;
    if (options.nodes != undefined || options.links != undefined) {
      this.updateData(undefined, clearCache);
    }
  };

  override changeSettings = (
    options: Omit<
      Partial<GraphCanvasInterface<NodeData, LinkData>>,
      "links" | "nodes" | "listeners" | "forceSettings"
    >,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
  ) => {
    if (options.graphSettings) {
      this.graphSettings = graphSettingsGetter(options.graphSettings, this.graphSettings);
      const draw = initDraw.call<
        GraphCanvas<NodeData, LinkData>,
        Parameters<typeof initDraw>,
        ReturnType<typeof initDraw>
      >(this);
      this.draw = this.initSmartDraw(draw);
      this.instantDraw = draw;
      initZoom.call<
        StaticGraphCanvas<NodeData, LinkData>,
        Parameters<typeof initZoom>,
        ReturnType<typeof initZoom>
      >(this, this.areaTransform);
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
    }

    this.tick();
    return undefined;
  };

  override destroy = () => {
    if (this._rafTickId != undefined) {
      cancelAnimationFrame(this._rafTickId);
      this._rafTickId = undefined;
    }
    this.clearHTMLElements();
    this.clearState();
    this.clearCache(true);
  };

  protected override updateData = (
    _alpha?: number,
    clearCache: boolean | GraphCanvasCacheKeys[] = true,
  ) => {
    if (clearCache) {
      this.clearCache(clearCache);
    }

    updateNodeCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateNodeCache>,
      ReturnType<typeof updateNodeCache>
    >(this);
    updateLinkCache.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof updateLinkCache>,
      ReturnType<typeof updateLinkCache>
    >(this);
    initZoom.call<
      StaticGraphCanvas<NodeData, LinkData>,
      Parameters<typeof initZoom>,
      ReturnType<typeof initZoom>
    >(this, this.areaTransform);
    this.fitToView();
    this.tick();
  };
}
