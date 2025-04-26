import type { GraphParticle } from "../../types";

type GetParticlePositionOptions = {
  particle: GraphParticle;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
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

  const dx = opts.xEnd - opts.xStart;
  const dy = opts.yEnd - opts.yStart;

  const newX = opts.xStart + dx * progress;
  const newY = opts.yStart + dy * progress;

  opts.particle.x = newX;
  opts.particle.y = newY;

  if (needSpeed) {
    opts.particle.step += prevStepDifference <= 3 ? prevStepDifference : 3;
  } else {
    opts.particle.step++;
  }
}
