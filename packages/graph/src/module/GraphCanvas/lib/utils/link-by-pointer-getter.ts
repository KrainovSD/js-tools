import { isObject } from "@krainovsd/js-helpers";
import { greatest } from "d3-array";
import type { ZoomTransform } from "d3-zoom";
import type { LinkInterface } from "../../types";
import { pointerGetter } from "./pointer-getter";

export type LinkByPointerGetterOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  mouseEvent: MouseEvent | TouchEvent;
  areaRect: DOMRect | undefined;
  areaTransform: ZoomTransform;
  links: LinkInterface<NodeData, LinkData>[];
  linkHoverExtraZone: number;
  curve: boolean;
};

export function linkByPointerGetter<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>({
  areaRect,
  areaTransform,
  mouseEvent,
  links,
  linkHoverExtraZone,
  curve,
}: LinkByPointerGetterOptions<NodeData, LinkData>): LinkInterface<NodeData, LinkData> | undefined {
  if (!areaRect) return undefined;

  const [pointerX, pointerY] = pointerGetter(mouseEvent, areaRect, areaTransform);

  return greatest(links, (link) => {
    if (
      !isObject(link.source) ||
      !isObject(link.target) ||
      link.source.visible === false ||
      link.target.visible === false
    )
      return;

    const x1 = link.source.x as number;
    const y1 = link.source.y as number;
    const x2 = link.target.x as number;
    const y2 = link.target.y as number;
    const cx = link._cx ?? 0;
    const cy = link._cy ?? 0;

    return curve
      ? isNearCurveLink(
          pointerX,
          pointerY,
          x1,
          y1,
          x2,
          y2,
          cx,
          cy,
          link._groupIndex ?? 1,
          linkHoverExtraZone,
        )
        ? link.index
        : undefined
      : isNearLink(pointerX, pointerY, x1, y1, x2, y2, linkHoverExtraZone)
        ? link.index
        : undefined;
  });
}

function isNearLink(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  threshold = 2,
) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

// function isNearCurveLink(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   cx: number,
//   cy: number,
//   groupIndex: number,
//   threshold = 2,
// ): boolean {
//   const dxLink = x2 - x1;
//   const dyLink = y2 - y1;
//   const lenSq = dxLink * dxLink + dyLink * dyLink;
//
//   const fastLen = lenSq > 0 ? ((lenSq + 0.5) / (Math.sqrt(lenSq) + 0.5)) * Math.sqrt(lenSq) : 1;
//
//   const curveOffset = (0.12 * fastLen * groupIndex) | 0;
//   const padding = curveOffset + threshold;
//   const minX = (x1 < x2 ? x1 : x2) - padding;
//   const maxX = (x1 > x2 ? x1 : x2) + padding;
//   const minY = (y1 < y2 ? y1 : y2) - padding;
//   const maxY = (y1 > y2 ? y1 : y2) + padding;
//
//   if (px - minX < 0 || px - maxX > 0 || py - minY < 0 || py - maxY > 0) {
//     return false;
//   }
//
//   return isPointNearBezierUltraFast(px, py, x1, y1, cx, cy, x2, y2, threshold);
// }
//
// function isPointNearBezierUltraFast(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   cx: number,
//   cy: number,
//   x2: number,
//   y2: number,
//   threshold: number,
// ): boolean {
//   const thresholdSq = threshold * threshold;
//
//   const segments = 4;
//
//   let dx = px - x1;
//   let dy = py - y1;
//   if (dx * dx + dy * dy <= thresholdSq) return true;
//
//   dx = px - x2;
//   dy = py - y2;
//   if (dx * dx + dy * dy <= thresholdSq) return true;
//
//   let prevX = x1;
//   let prevY = y1;
//
//   const step = 1 / segments;
//
//   let t = step;
//   let mt = 1 - t;
//   let x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
//   let y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
//
//   if (distanceToSegmentSquaredFast(px, py, prevX, prevY, x, y) <= thresholdSq) return true;
//   prevX = x;
//   prevY = y;
//
//   t = 2 * step;
//   mt = 1 - t;
//   x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
//   y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
//
//   if (distanceToSegmentSquaredFast(px, py, prevX, prevY, x, y) <= thresholdSq) return true;
//   prevX = x;
//   prevY = y;
//
//   t = 3 * step;
//   mt = 1 - t;
//   x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
//   y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
//
//   if (distanceToSegmentSquaredFast(px, py, prevX, prevY, x, y) <= thresholdSq) return true;
//   prevX = x;
//   prevY = y;
//
//   if (distanceToSegmentSquaredFast(px, py, prevX, prevY, x2, y2) <= thresholdSq) return true;
//
//   return false;
// }
//
// function distanceToSegmentSquaredFast(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
// ): number {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//
//   if (dx === 0 && dy === 0) {
//     const dxp = px - x1;
//     const dyp = py - y1;
//     return dxp * dxp + dyp * dyp;
//   }
//
//   const tNum = (px - x1) * dx + (py - y1) * dy;
//   const tDenom = dx * dx + dy * dy;
//   let t = tNum / tDenom;
//
//   t = t < 0 ? 0 : t > 1 ? 1 : t;
//
//   const nearestX = x1 + t * dx;
//   const nearestY = y1 + t * dy;
//
//   const dxp = px - nearestX;
//   const dyp = py - nearestY;
//
//   return dxp * dxp + dyp * dyp;
// }

// TEST2
// function isNearCurveLink(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   cx: number,
//   cy: number,
//   groupIndex: number,
//   threshold = 2,
// ): boolean {
//   // 1. Исправляем bounding box: нужно учитывать контрольную точку!
//   const absGroupIndex = Math.abs(groupIndex);
//
//   // Находим реальные границы кривой (с контрольной точкой)
//   const minX = Math.min(x1, x2, cx);
//   const maxX = Math.max(x1, x2, cx);
//   const minY = Math.min(y1, y2, cy);
//   const maxY = Math.max(y1, y2, cy);
//
//   // Расширяем с учетом threshold и изгиба
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const len = Math.sqrt(dx * dx + dy * dy);
//   const curveOffset = 0.12 * len * absGroupIndex;
//   const padding = Math.max(threshold, curveOffset) + 5; // +5 запас
//
//   // Быстрая проверка bounding box
//   if (px < minX - padding || px > maxX + padding || py < minY - padding || py > maxY + padding) {
//     return false;
//   }
//
//   // 2. Увеличиваем точность проверки
//   return isPointNearBezierUltraFast(px, py, x1, y1, cx, cy, x2, y2, threshold);
// }
//
// function isPointNearBezierUltraFast(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   cx: number,
//   cy: number,
//   x2: number,
//   y2: number,
//   threshold: number,
// ): boolean {
//   const thresholdSq = threshold * threshold;
//
//   // Увеличиваем количество сегментов для точности
//   const segments = 8; // Было 4, стало 8
//
//   // Проверяем расстояние до начальной и конечной точек
//   let dx = px - x1;
//   let dy = py - y1;
//   if (dx * dx + dy * dy <= thresholdSq) return true;
//
//   dx = px - x2;
//   dy = py - y2;
//   if (dx * dx + dy * dy <= thresholdSq) return true;
//
//   // Проверяем расстояние до контрольной точки
//   dx = px - cx;
//   dy = py - cy;
//   if (dx * dx + dy * dy <= thresholdSq) return true; // Более широкий порог
//
//   let prevX = x1;
//   let prevY = y1;
//   const step = 1 / segments;
//
//   // Делим на больше сегментов
//   for (let i = 1; i <= segments; i++) {
//     const t = i * step;
//     const mt = 1 - t;
//
//     // Точка на кривой Безье
//     const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
//     const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
//
//     // Проверяем расстояние до отрезка
//     if (distanceToSegmentSquaredFast(px, py, prevX, prevY, x, y) <= thresholdSq) {
//       return true;
//     }
//
//     prevX = x;
//     prevY = y;
//   }
//
//   return false;
// }
//
// function distanceToSegmentSquaredFast(
//   px: number,
//   py: number,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
// ): number {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//
//   // Вырожденный отрезок (точка)
//   if (dx === 0 && dy === 0) {
//     const dxp = px - x1;
//     const dyp = py - y1;
//     return dxp * dxp + dyp * dyp;
//   }
//
//   // Проекция точки на прямую
//   const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
//
//   // Ограничиваем точкой на отрезке
//   let nearestX, nearestY;
//   if (t <= 0) {
//     nearestX = x1;
//     nearestY = y1;
//   } else if (t >= 1) {
//     nearestX = x2;
//     nearestY = y2;
//   } else {
//     nearestX = x1 + t * dx;
//     nearestY = y1 + t * dy;
//   }
//
//   // Квадрат расстояния
//   const dxp = px - nearestX;
//   const dyp = py - nearestY;
//   return dxp * dxp + dyp * dyp;
// }
//

//TEST3
function isNearCurveLink(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  groupIndex: number,
  threshold = 2,
): boolean {
  // Быстрая проверка bounding box
  const minX = Math.min(x1, x2, cx) - threshold - 2;
  const maxX = Math.max(x1, x2, cx) + threshold + 2;
  const minY = Math.min(y1, y2, cy) - threshold - 2;
  const maxY = Math.max(y1, y2, cy) + threshold + 2;

  if (px < minX || px > maxX || py < minY || py > maxY) {
    return false;
  }

  // Используем точное вычисление расстояния до кривой Безье
  const minDistanceSq = distanceToQuadraticBezierSquared(px, py, x1, y1, cx, cy, x2, y2);
  return minDistanceSq <= threshold * threshold;
}

// Вычисление квадрата расстояния до квадратичной кривой Безье
function distanceToQuadraticBezierSquared(
  px: number,
  py: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
): number {
  // Преобразуем задачу: находим t, минимизирующее (B(t) - P)²

  // Коэффициенты для квадратичной кривой Безье:
  // B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
  // = P₀ - 2tP₀ + t²P₀ + 2tP₁ - 2t²P₁ + t²P₂
  // = P₀ + t(-2P₀ + 2P₁) + t²(P₀ - 2P₁ + P₂)

  const ax = x1 - 2 * cx + x2;
  const ay = y1 - 2 * cy + y2;
  const bx = 2 * (cx - x1);
  const by = 2 * (cy - y1);
  const cx0 = x1 - px; // cₓ
  const cy0 = y1 - py; // cᵧ

  // Функция расстояния: f(t) = (ax*t² + bx*t + cx0)² + (ay*t² + by*t + cy0)²
  // Ее производная: f'(t) = 2(ax*t² + bx*t + cx0)(2ax*t + bx) + 2(ay*t² + by*t + cy0)(2ay*t + by)

  // Решаем кубическое уравнение f'(t) = 0
  // Раскрываем скобки и получаем коэффициенты для t³, t², t, константа

  const A = 2 * (ax * ax + ay * ay);
  const B = 3 * (ax * bx + ay * by);
  const C = bx * bx + by * by + 2 * (ax * cx0 + ay * cy0);
  const D = bx * cx0 + by * cy0;

  // Кубическое уравнение: A*t³ + B*t² + C*t + D = 0
  // Нормализуем: t³ + (B/A)*t² + (C/A)*t + (D/A) = 0
  const a = B / A;
  const b = C / A;
  const c = D / A;

  // Находим корни кубического уравнения
  const roots = solveCubic(a, b, c);

  let minDistSq = Infinity;

  // Проверяем все корни в диапазоне [0, 1] и конечные точки
  const testPoints = [0, 1, ...roots.filter((t) => t >= 0 && t <= 1)];

  for (const t of testPoints) {
    // Точка на кривой
    const mt = 1 - t;
    const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
    const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;

    const dx = px - x;
    const dy = py - y;
    const distSq = dx * dx + dy * dy;

    if (distSq < minDistSq) {
      minDistSq = distSq;
    }
  }

  return minDistSq;
}

// Решение кубического уравнения x³ + ax² + bx + c = 0
function solveCubic(a: number, b: number, c: number): number[] {
  // Приводим к виду y³ + py + q = 0
  const p = b - (a * a) / 3;
  const q = (2 * a * a * a) / 27 - (a * b) / 3 + c;

  const discriminant = (q * q) / 4 + (p * p * p) / 27;

  const roots: number[] = [];

  if (discriminant > 0) {
    // Один действительный корень
    const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
    const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
    roots.push(u + v - a / 3);
  } else if (discriminant === 0) {
    // Кратные корни
    const u = Math.cbrt(-q / 2);
    roots.push(2 * u - a / 3);
    roots.push(-u - a / 3); // Двойной корень
  } else {
    // Три действительных корня
    const phi = Math.acos((-q / 2) * Math.sqrt(-27 / (p * p * p))) / 3;
    const r = 2 * Math.sqrt(-p / 3);

    roots.push(r * Math.cos(phi) - a / 3);
    roots.push(r * Math.cos(phi + (2 * Math.PI) / 3) - a / 3);
    roots.push(r * Math.cos(phi + (4 * Math.PI) / 3) - a / 3);
  }

  return roots;
}
