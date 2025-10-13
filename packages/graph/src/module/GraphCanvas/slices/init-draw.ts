import { setDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import { getDrawLink } from "./draw-links";
import { getDrawNode } from "./draw-nodes";

export function initDraw<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  let hasHighlight = false;

  function calculateHighlight(this: GraphCanvas<NodeData, LinkData>, recursive: boolean) {
    if (hasHighlight && !recursive) return;

    /** animation up */
    if (!this.highlightWorking && this.highlightProgress > 0) {
      const highlightDownStep = 1 / this.highlightSettings.highlightDownFrames;
      this.highlightProgress -= highlightDownStep;

      if (!this.simulationWorking) {
        hasHighlight = true;

        return void requestAnimationFrame(() => this.draw(true));
      }

      if (!this.linkSettings.particles) {
        hasHighlight = false;

        return;
      }
    }
    /** animation down */
    if (this.highlightWorking && this.highlightProgress < 1) {
      const highlightUpStep = 1 / this.highlightSettings.highlightUpFrames;
      this.highlightProgress += highlightUpStep;

      if (!this.simulationWorking) {
        hasHighlight = true;

        return void requestAnimationFrame(() => this.draw(true));
      }

      if (!this.linkSettings.particles) {
        hasHighlight = false;

        return;
      }
    }
    /** animation active */
    if (this.linkSettings.particles && this.highlightWorking && !this.simulationWorking) {
      hasHighlight = true;

      return void requestAnimationFrame(() => this.draw(true));
    }

    /** animation stop */
    if (!this.highlightWorking && this.highlightProgress <= 0) {
      if (this.highlightedNeighbors || this.highlightedNode || this.highlightedLink) {
        this.highlightedNeighbors = null;
        this.highlightedNode = null;
        this.highlightedLink = null;
        this.particles = {};

        if (!this.simulationWorking) {
          hasHighlight = true;

          return void requestAnimationFrame(() => this.draw(true));
        }
      }
    }

    hasHighlight = false;
  }

  function draw(this: GraphCanvas<NodeData, LinkData>, recursive: boolean = false) {
    if (!this.context) return;

    if (this.listeners.onDraw) {
      this.listeners.onDraw.call(this);

      return;
    }

    this.context.save();
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.translate(this.areaTransform.x, this.areaTransform.y);
    this.context.scale(this.areaTransform.k, this.areaTransform.k);

    const textRenders: (() => void)[] = [];
    const nodeRenders: (() => void)[] = [];
    this.nodes.forEach(getDrawNode<NodeData, LinkData>(nodeRenders, textRenders).bind(this));

    /** links */
    this.links.forEach(getDrawLink<NodeData, LinkData>().bind(this));

    /** nodes */

    nodeRenders.forEach((render) => render());
    textRenders.forEach((render) => render());

    this.context.restore();

    this.listeners.onDrawFinished?.call?.(this);

    calculateHighlight.bind(this)(recursive);
  }

  if (this.graphSettings.showDrawTime) {
    return setDrawTime(draw.bind(this), this.graphSettings.showDrawTimeEveryTick);
  }

  return draw.bind(this);
}
