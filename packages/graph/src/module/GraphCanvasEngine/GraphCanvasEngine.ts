import * as d3 from "d3";
import { Viewport } from "pixi-viewport";
import {
  Application,
  BackgroundSystem,
  Circle,
  type FederatedPointerEvent,
  Graphics,
} from "pixi.js";
import type { LinkInterface } from "@/types/links";
import type { NodeInterface } from "@/types/nodes";
import type { GraphCanvasEngineInterface } from "./GraphCanvasEngine.types";

type GraphicsInterface<NodeData extends Record<string, unknown>> = Graphics & {
  element?: NodeInterface<NodeData>;
};

const POSITION_X_CONSTANT = 0;
const POSITION_Y_CONSTANT = 0;

export class GraphCanvasEngine<
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

  private linkElements: Graphics | undefined;

  private nodeElements: Graphics[] | undefined;

  private color = d3.scaleOrdinal(d3.schemeCategory10);

  private root: HTMLElement;

  private core: Application | undefined;

  private viewport: Viewport | undefined;

  constructor({ links, nodes, root }: GraphCanvasEngineInterface<NodeData, LinkData>) {
    this.root = root;
    const { width, height } = root.getBoundingClientRect();

    this.nodes = nodes;
    this.links = links;
    this.height = height;
    this.width = width;

    void this.updateView();
  }

  changeData(options: Omit<Partial<GraphCanvasEngineInterface<NodeData, LinkData>>, "selector">) {
    if (options.links != undefined) this.links = options.links;
    if (options.nodes != undefined) this.nodes = options.nodes;

    void this.updateView();
  }

  start() {
    void this.updateView();
  }

  stop() {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = undefined;
    }
    if (this.linkElements) {
      this.linkElements.clear();
      this.linkElements = undefined;
    }
    if (this.nodeElements) {
      this.nodeElements.forEach((node) => node.clear());
      this.nodeElements = undefined;
    }
  }

  destroy() {
    this.stop();
    if (this.viewport) {
      const newRoot = this.root.cloneNode() as HTMLElement;
      this.root.parentElement?.appendChild?.(newRoot);
      this.root.insertAdjacentElement("afterend", newRoot);
      this.viewport.destroy();
      this.root.remove();
      this.viewport = undefined;
      this.root = newRoot;
    }

    if (this.core) {
      this.core.destroy();
      this.core = undefined;
    }
  }

  private async updateView() {
    /** init application core */
    if (!this.core) {
      this.core = new Application();
      await this.core.init({
        width: this.width,
        height: this.height,
        antialias: false,
        resolution: 1,
      });
      this.root.appendChild(this.core.canvas);
      const background = new BackgroundSystem();
      background.init({ backgroundColor: "#e5e5e5", backgroundAlpha: 1, clearBeforeRender: true });
      this.core.renderer.background = background;
    }
    if (!this.viewport) {
      this.viewport = new Viewport({
        screenWidth: this.width,
        screenHeight: this.height,
        worldWidth: this.width,
        worldHeight: this.height,
        events: this.core.renderer.events,
      });
      this.core.stage.addChild(this.viewport);
      this.viewport.drag().pinch().wheel({}).decelerate().clampZoom({ minScale: 0.5, maxScale: 5 });
    }
    if (!this.simulation) {
      this.simulation = d3.forceSimulation<
        NodeInterface<NodeData>,
        LinkInterface<NodeData, LinkData>
      >();
    }

    this.clearState();

    this.linkElements = new Graphics();
    this.viewport.addChild(this.linkElements);
    this.createNodes();
    this.updateSimulation();
  }

  private clearState() {
    if (this.nodeElements) this.nodeElements.forEach((el) => el.clear());
    if (this.linkElements) this.linkElements.clear();
  }

  private createNodes() {
    if (!this.viewport || !this.simulation || !this.core) {
      throw new Error("bad init");
    }

    const viewport = this.viewport;
    const simulation = this.simulation;
    const dragRef: { current: Graphics | null } = { current: null };

    function onDragStart(this: Graphics) {
      viewport.plugins.pause("drag");
      simulation.alphaTarget(0.3).restart();
      this.alpha = 0.5;
      dragRef.current = this;
    }

    function onDragMove(this: GraphicsInterface<NodeData>, event: FederatedPointerEvent) {
      if (dragRef.current && dragRef.current === this && this.element) {
        const newPosition = event.getLocalPosition(this.parent);
        this.element.fx = newPosition.x;
        this.element.fy = newPosition.y;
      }
    }

    function onDragEnd(this: Graphics) {
      simulation.alphaTarget(0);
      dragRef.current = null;
      this.alpha = 1;
      // this.fx = null;
      // this.fy = null;
      viewport.plugins.resume("drag");
    }

    // function onMouseOver(this: Graphics, event: FederatedPointerEvent) {}

    // function onMouseOut(this: Graphics, event: FederatedPointerEvent) {}

    this.nodeElements = this.nodes.map<Graphics>((node) => {
      const nodeElement: GraphicsInterface<NodeData> = new Graphics()
        .circle(0, 0, 5)
        .fill(this.color(String(node.group)))
        .stroke({ width: 1, color: "white" })
        // .on("pointerdown", onDragStart)
        // .on("pointerup", onDragEnd)
        // .on("pointerupoutside", onDragEnd)
        // .on("pointermove", onDragMove)
        .on("mousedown", onDragStart)
        .on("mouseup", onDragEnd)
        .on("mouseupoutside", onDragEnd)
        .on("mousemove", (event) => onDragMove.bind(nodeElement)(event));
      // .on("pointerover", function onMouseOver() {
      //   console.log(this);
      // })
      // .on("pointerout", function onMouseOut() {
      //   console.log(this);
      // })

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // const sprite = new Sprite(this.core!.renderer.generateTexture(nodeElement));
      nodeElement.hitArea = new Circle(0, 0, 24);
      nodeElement.interactive = true;
      nodeElement.cursor = "pointer";
      // nodeElement.hitArea = new Circle(0, 0, 24);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.viewport!.addChild(nodeElement);
      node.element = nodeElement;
      nodeElement.element = node;

      return nodeElement;
    });
  }

  private updateSimulation() {
    if (!this.simulation || !this.linkElements) {
      throw new Error("bad init");
    }

    this.simulation
      .nodes(this.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links)
          .id((d) => d.id)
          .distance(16)
          .strength(1),
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("charge", d3.forceManyBody<NodeInterface<NodeData>>().strength(-15))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2).strength(1))
      .force("collide", d3.forceCollide().radius(7).strength(1).iterations(1));
    // .force("collision", d3.forceCollide().radius(7).iterations(2))
    // .restart();
    // this.simulation.stop();

    const linkElements = this.linkElements;

    const ticked = () => {
      this.nodes.forEach((node) => {
        const { x, y, element } = node;
        if (!element || x == undefined || y == undefined) return;
        // element.position = new Point(x, y);
        element.x = x;
        element.y = y;
      });

      for (let i = linkElements.children.length - 1; i >= 0; i--) {
        linkElements.children[i].destroy();
      }

      linkElements.clear();
      // linkElements.removeChildren();
      linkElements.alpha = 0.3;

      this.links.forEach((link) => {
        const { source, target } = link;
        if (typeof source !== "object" || typeof target !== "object") return;

        linkElements
          .moveTo(source.x || POSITION_X_CONSTANT, source.y || POSITION_Y_CONSTANT)
          .lineTo(target.x || POSITION_X_CONSTANT, target.y || POSITION_Y_CONSTANT)
          .stroke({ width: 2, color: "black" });
      });
    };

    this.simulation.on("tick", ticked);
    this.simulation.on("end", () => {
      // eslint-disable-next-line no-console
      console.log("simulation finished");
    });

    this.simulation.restart();
  }
}
