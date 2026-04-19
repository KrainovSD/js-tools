import type { LinkParticle } from "../../types";

type GetParticlePositionOptions = {
  particle: LinkParticle;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  xControl: number;
  yControl: number;
  distance: number;
  totalCount: number;
  index: number;
  duration: number;
  start: number;
};

export function getParticlePosition(opts: GetParticlePositionOptions) {
  const startDuration = (opts.duration / opts.totalCount) * opts.index;
  const elapsed = performance.now() - opts.start - startDuration;
  if (elapsed < 0) return;
  const progress = Math.min((elapsed % opts.duration) / opts.duration, 1);
  if (opts.xControl !== 0 && opts.yControl !== 0) {
    const t = 1 - progress;
    opts.particle.x =
      t * t * opts.xStart + 2 * t * progress * opts.xControl + progress * progress * opts.xEnd;
    opts.particle.y =
      t * t * opts.yStart + 2 * t * progress * opts.yControl + progress * progress * opts.yEnd;
  } else {
    const dx = opts.xEnd - opts.xStart;
    const dy = opts.yEnd - opts.yStart;
    opts.particle.x = opts.xStart + dx * progress;
    opts.particle.y = opts.yStart + dy * progress;
  }
}

export function approximateQuadraticBezierLength(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx01 = x1 - x0;
  const dy01 = y1 - y0;
  const dx12 = x2 - x1;
  const dy12 = y2 - y1;
  const dx02 = x2 - x0;
  const dy02 = y2 - y0;
  const a = Math.sqrt(dx01 * dx01 + dy01 * dy01);
  const b = Math.sqrt(dx12 * dx12 + dy12 * dy12);
  const c = Math.sqrt(dx02 * dx02 + dy02 * dy02);

  return (a + b + c) / 2;
}
