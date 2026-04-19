import { setDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import { getDrawLink } from "./draw-links";
import { getDrawNode } from "./draw-nodes";

export function initDraw<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  function draw(this: GraphCanvas<NodeData, LinkData>) {
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
  }

  if (this.graphSettings.showDrawTime) {
    return setDrawTime(draw.bind(this), this.graphSettings.showDrawTimeEveryTick);
  }

  return draw.bind(this);
}
