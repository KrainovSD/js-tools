import { setDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import type {
  DeferredDraw,
  LinkArrowDrawBatch,
  LinkDrawBatch,
  LinkParticleDrawBatch,
  NodeDrawBatch,
  NodeTextDrawBatch,
} from "../types";
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
    const nodeBatch: Record<string, NodeDrawBatch[]> = {};
    const nodeImageBatch: Record<string, NodeDrawBatch[]> = {};
    const textBatch: Record<string, Record<string, NodeTextDrawBatch[]>> = {};
    const deferredNodeDraw: DeferredDraw[] = [];
    const deferredTextDraw: DeferredDraw[] = [];
    this.nodes.forEach(
      getDrawNode<NodeData, LinkData>(
        nodeBatch,
        nodeImageBatch,
        textBatch,
        deferredNodeDraw,
        deferredTextDraw,
      ).bind(this),
    );
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
    const nodeKeys = Object.keys(nodeBatch);
    for (let i = 0; i < nodeKeys.length; i++) {
      const key = nodeKeys[i];
      const group = nodeBatch[key];
      const [alpha, bcolor, width, color] = key.split("|");
      this.context.beginPath();
      this.context.globalAlpha = +alpha;
      this.context.strokeStyle = bcolor;
      this.context.lineWidth = +width;
      this.context.fillStyle = color;
      for (let j = 0; j < group.length; j++) {
        const item = group[j];
        switch (item.shape) {
          case "circle": {
            this.context.moveTo(item.x + item.radius, item.y);
            this.context.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
            break;
          }
          case "square": {
            this.context.roundRect(
              item.x - item.width / 2,
              item.y - item.height / 2,
              item.width,
              item.height,
              item.radius,
            );
            break;
          }
          case "text": {
            if (this.nodeSettings.textNodeDebug) {
              this.context.rect(
                item.x - item.width / 2,
                item.y - item.height / 2,
                item.width,
                item.height,
              );
            }
            break;
          }
          default: {
          }
        }
      }
      this.context.fill();
      if (+width > 0) {
        this.context.stroke();
      }
    }
    const nodeImageKeys = Object.keys(nodeImageBatch);
    for (let i = 0; i < nodeImageKeys.length; i++) {
      const key = nodeImageKeys[i];
      const group = nodeImageBatch[key];
      const [alpha, bcolor, width, color] = key.split("|");
      this.context.globalAlpha = +alpha;
      this.context.strokeStyle = bcolor;
      this.context.lineWidth = +width;
      this.context.fillStyle = color;
      for (let j = 0; j < group.length; j++) {
        const item = group[j];
        if (!item.image) continue;
        this.context.beginPath();
        switch (item.shape) {
          case "circle": {
            this.context.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
            this.context.closePath();
            this.context.save();
            this.context.clip();
            this.context.drawImage(
              item.image,
              item.x - item.radius,
              item.y - item.radius,
              item.radius * 2,
              item.radius * 2,
            );
            this.context.restore();
            break;
          }
          case "square": {
            this.context.roundRect(
              item.x - item.width / 2,
              item.y - item.height / 2,
              item.width,
              item.height,
              item.radius,
            );
            this.context.closePath();
            this.context.save();
            this.context.clip();
            this.context.drawImage(
              item.image,
              item.x - item.width / 2,
              item.y - item.height / 2,
              item.width,
              item.height,
            );
            this.context.restore();
            break;
          }
          default: {
            continue;
          }
        }
        if (+width > 0) {
          this.context.stroke();
        }
      }
    }
    const textKeys = Object.keys(textBatch);
    for (let i = 0; i < textKeys.length; i++) {
      const font = textKeys[i];
      const fontGroup = textBatch[font];
      const textInnerKeys = Object.keys(fontGroup);
      this.context.font = font;
      for (let j = 0; j < textInnerKeys.length; j++) {
        const key = textInnerKeys[j];
        const group = fontGroup[key];
        const [alpha, align, color] = key.split("|");
        this.context.globalAlpha = +alpha;
        this.context.textAlign = align as CanvasTextAlign;
        this.context.fillStyle = color;
        for (let k = 0; k < group.length; k++) {
          const item = group[k];
          this.context.fillText(item.text, item.x, item.y);
        }
      }
    }
    deferredNodeDraw.forEach((draw) => draw());
    deferredTextDraw.forEach((draw) => draw());
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
