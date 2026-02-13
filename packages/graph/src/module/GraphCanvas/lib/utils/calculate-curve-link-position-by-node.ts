import { COMMON_SETTINGS } from "../../constants";
import type { NodeInterface } from "../../types";

export function calculateCurveLinkPositionByNode<NodeData extends Record<string, unknown>>(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  sourceNode: NodeInterface<NodeData>,
  targetNode: NodeInterface<NodeData>,
  groupIndex: number,
  arrowSize: number = 0,
) {
  const sourceRadius =
    (sourceNode._radius ?? COMMON_SETTINGS.nodeRadius) + (sourceNode._borderWidth ?? 0) * 0.5;
  const targetRadius =
    (targetNode._radius ?? COMMON_SETTINGS.nodeRadius) + (targetNode._borderWidth ?? 0) * 0.5;
  const effectiveTargetRadius = targetRadius + arrowSize * 0.9;

  const mx = (xStart + xEnd) * 0.5;
  const my = (yStart + yEnd) * 0.5;
  const dx = xEnd - xStart;
  const dy = yEnd - yStart;
  const lenSq = dx * dx + dy * dy;
  const len = lenSq > 0 ? Math.sqrt(lenSq) : 1;

  const nx = -dy / len;
  const ny = dx / len;

  const offset = 0.12 * len * groupIndex;

  const xControl = mx + nx * offset;
  const yControl = my + ny * offset;

  const [xStartP, yStartP] = adjustPoint(xStart, yStart, xControl, yControl, sourceRadius);
  const [xEndP, yEndP] = adjustPoint(xEnd, yEnd, xControl, yControl, effectiveTargetRadius);
  const [xEndArrow, yEndArrow] = adjustPoint(xEnd, yEnd, xControl, yControl, targetRadius);

  return {
    xStart: xStartP,
    yStart: yStartP,
    xEnd: xEndP,
    yEnd: yEndP,
    xControl,
    yControl,
    xEndArrow,
    yEndArrow,
  };
}

function adjustPoint(
  x: number,
  y: number,
  xControl: number,
  yControl: number,
  radius: number,
): [number, number] {
  const dxToControl = xControl - x;
  const dyToControl = yControl - y;
  const distToControl = Math.sqrt(dxToControl * dxToControl + dyToControl * dyToControl) || 1;

  return [x + (dxToControl / distToControl) * radius, y + (dyToControl / distToControl) * radius];
}
