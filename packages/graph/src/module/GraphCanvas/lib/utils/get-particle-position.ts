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
  speed: number;
  now: number;
};

const FRAME_INTERVAL = 1000 / 60;

export function getParticlePosition(opts: GetParticlePositionOptions) {
  const now = opts.now;
  const particle = opts.particle;

  if (particle._lastTime == undefined) {
    particle._distanceTraveled = (opts.distance / opts.totalCount) * particle.index;
    particle._lastTime = now;
    particle._lastDistance = opts.distance;
  }

  const lastDistance = particle._lastDistance ?? 0;
  if (lastDistance !== opts.distance && lastDistance > 0) {
    const scale = opts.distance / lastDistance;
    particle._distanceTraveled = ((particle._distanceTraveled ?? 0) * scale) % opts.distance;
    particle._lastDistance = opts.distance;
  }

  const delta = Math.min(now - particle._lastTime, FRAME_INTERVAL);
  particle._lastTime = now;
  particle._distanceTraveled =
    ((particle._distanceTraveled ?? 0) + opts.speed * delta) % opts.distance;

  const progress = particle._distanceTraveled / opts.distance;
  if (opts.xControl !== 0 && opts.yControl !== 0) {
    const t = 1 - progress;
    particle.x =
      t * t * opts.xStart + 2 * t * progress * opts.xControl + progress * progress * opts.xEnd;
    particle.y =
      t * t * opts.yStart + 2 * t * progress * opts.yControl + progress * progress * opts.yEnd;
  } else {
    const dx = opts.xEnd - opts.xStart;
    const dy = opts.yEnd - opts.yStart;
    particle.x = opts.xStart + dx * progress;
    particle.y = opts.yStart + dy * progress;
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
