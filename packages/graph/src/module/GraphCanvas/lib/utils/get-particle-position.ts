import type { GraphParticle } from "../../types";

type GetParticlePositionOptions = {
  particle: GraphParticle;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  totalSteps: number;
};

export function getParticlePosition(opts: GetParticlePositionOptions) {
  if (opts.particle.wait > 0) {
    opts.particle.wait--;

    return;
  }

  const remainingSteps = opts.totalSteps - opts.particle.step;
  const progress = opts.particle.step / opts.totalSteps;

  if (
    opts.particle.targetId === "027-437-502-794-894" ||
    opts.particle.targetId === "007-245-406-573-328"
  ) {
    console.log(opts.totalSteps, opts.particle.step, remainingSteps, progress);
  }

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
  opts.particle.step++;
}
