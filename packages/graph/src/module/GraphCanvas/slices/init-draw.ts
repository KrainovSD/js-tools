import { setDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import type { LinkArrowDrawBatch, LinkDrawBatch, LinkParticleDrawBatch } from "../types";
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
    const linkBatch: Record<string, LinkDrawBatch[]> = {};
    const particleBatch: Record<string, LinkParticleDrawBatch[]> = {};
    const arrowBatch: Record<string, LinkArrowDrawBatch[]> = {};
    this.links.forEach(
      getDrawLink<NodeData, LinkData>(linkBatch, particleBatch, arrowBatch).bind(this),
    );
    const linkKeys = Object.keys(linkBatch);
    for (let i = 0; i < linkKeys.length; i++) {
      const key = linkKeys[i];
      const group = linkBatch[key];
      const [alpha, color, width] = key.split("|");
      this.context.beginPath();
      this.context.globalAlpha = +alpha;
      this.context.strokeStyle = color;
      this.context.lineWidth = +width;
      for (let j = 0; j < group.length; j++) {
        const item = group[j];
        if (!item.curve) {
          this.context.moveTo(item.xStart, item.yStart);
          this.context.lineTo(item.xEnd, item.yEnd);
        } else {
          this.context.moveTo(item.xStart, item.yStart);
          this.context.quadraticCurveTo(item.xControl, item.yControl, item.xEnd, item.yEnd);
          this.context.setLineDash([]);
        }
      }
      this.context.stroke();
    }
    const particleKeys = Object.keys(particleBatch);
    for (let i = 0; i < particleKeys.length; i++) {
      const key = particleKeys[i];
      const group = particleBatch[key];
      const [bcolor, width, color] = key.split("|");
      this.context.beginPath();
      this.context.strokeStyle = bcolor;
      this.context.lineWidth = +width;
      this.context.fillStyle = color;
      for (let j = 0; j < group.length; j++) {
        const item = group[j];
        this.context.moveTo(item.x + item.r, item.y);
        this.context.arc(item.x, item.y, item.r, 0, Math.PI * 2);
      }
      this.context.fill();
      if (+width > 0) {
        this.context.stroke();
      }
    }
    const arrowKeys = Object.keys(arrowBatch);
    for (let i = 0; i < arrowKeys.length; i++) {
      const key = arrowKeys[i];
      const group = arrowBatch[key];
      const [alpha, bcolor, width, color] = key.split("|");
      this.context.beginPath();
      this.context.globalAlpha = +alpha;
      this.context.strokeStyle = bcolor;
      this.context.lineWidth = +width;
      this.context.fillStyle = color;
      for (let j = 0; j < group.length; j++) {
        const item = group[j];
        this.context.moveTo(item.x, item.y);
        this.context.lineTo(
          item.x - item.size * Math.cos(item.angle - Math.PI / 6),
          item.y - item.size * Math.sin(item.angle - Math.PI / 6),
        );
        this.context.lineTo(
          item.x - item.size * Math.cos(item.angle + Math.PI / 6),
          item.y - item.size * Math.sin(item.angle + Math.PI / 6),
        );
        this.context.closePath();
      }
      this.context.fill();
      if (+width > 0) {
        this.context.stroke();
      }
    }

    /** nodes */

    nodeRenders.forEach((render) => render());
    textRenders.forEach((render) => render());

    this.context.restore();

    /** selection rectangle */
    if (this.isSelecting && this.selectionRect) {
      const rect = this.selectionRect;
      const screenX = Math.min(rect.x1, rect.x2) * this.areaTransform.k + this.areaTransform.x;
      const screenY = Math.min(rect.y1, rect.y2) * this.areaTransform.k + this.areaTransform.y;
      const screenW = Math.abs(rect.x2 - rect.x1) * this.areaTransform.k;
      const screenH = Math.abs(rect.y2 - rect.y1) * this.areaTransform.k;

      this.context.fillStyle = "rgba(66, 133, 244, 0.2)";
      this.context.fillRect(screenX, screenY, screenW, screenH);
      this.context.strokeStyle = "rgba(66, 133, 244, 0.8)";
      this.context.lineWidth = 2;
      this.context.strokeRect(screenX, screenY, screenW, screenH);
    }
    this.listeners.onDrawFinished?.call?.(this);
  }

  if (this.graphSettings.showDrawTime) {
    return setDrawTime(draw.bind(this), this.graphSettings.showDrawTimeEveryTick);
  }

  return draw.bind(this);
}
