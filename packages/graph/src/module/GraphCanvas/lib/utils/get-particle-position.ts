import type { LinkParticle } from "../../types";

type GetParticlePositionOptions = {
  particle: LinkParticle;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  xControl: number;
  yControl: number;
  totalSteps: number;
  totalCount: number;
  distance: number;
};

export function getParticlePosition(opts: GetParticlePositionOptions) {
  const prevStepDifference = opts.particle.step - (opts.particle.prev?.step ?? 0);
  const nextStepDifference = (opts.particle.next?.step ?? 0) - opts.particle.step;

  const needWait =
    opts.particle.next &&
    opts.particle.next.step > opts.particle.step &&
    nextStepDifference <= opts.distance;
  const needSpeed =
    opts.particle.prev &&
    opts.particle.prev.step !== 0 &&
    opts.particle.prev.step < opts.particle.step &&
    prevStepDifference < opts.distance;

  if (opts.particle.step === 0 && needWait) {
    opts.particle.x = undefined;
    opts.particle.y = undefined;
    return;
  }

  const remainingSteps = opts.totalSteps - opts.particle.step;
  const progress = opts.particle.step / opts.totalSteps;

  if (remainingSteps <= 0) {
    opts.particle.x = opts.xEnd;
    opts.particle.y = opts.yEnd;
    opts.particle.step = 0;
    return;
  }

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

  if (needSpeed) {
    opts.particle.step += prevStepDifference <= 3 ? prevStepDifference : 3;
  } else {
    opts.particle.step++;
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
