import { setDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import { getDrawLink } from "./draw-links";
import { getDrawNode } from "./draw-nodes";

export function initDraw<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  function calculateHighlight(this: GraphCanvas<NodeData, LinkData>) {
    this.highlightDrawing = true;

    if (!this.highlightWorking && this.highlightProgress > 0) {
      const highlightDownStep = 1 / this.graphSettings.highlightDownFrames;
      this.highlightProgress -= highlightDownStep;

      if (!this.simulationWorking) {
        return void requestAnimationFrame(() => this.draw());
      }

      if (!this.linkSettings.particles) return;
    }
    if (this.highlightWorking && this.highlightProgress < 1) {
      const highlightUpStep = 1 / this.graphSettings.highlightUpFrames;
      this.highlightProgress += highlightUpStep;

      if (!this.simulationWorking) {
        return void requestAnimationFrame(() => this.draw());
      }

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

        if (!this.simulationWorking) {
          return void requestAnimationFrame(() => this.draw());
        }
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

    calculateHighlight.bind(this)();
  }

  if (this.graphSettings.showDrawTime) {
    return setDrawTime(draw.bind(this), this.graphSettings.showDrawTimeEveryTick);
  }

  return draw.bind(this);
}
