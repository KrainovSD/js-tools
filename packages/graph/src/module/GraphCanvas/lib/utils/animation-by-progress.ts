export function animationByProgress(initial: number, additional: number, progress: number) {
  const max = initial + additional;

  let current = initial + (max - initial) * progress;
  if (current > max) current = max;
  if (current < initial) current = initial;

  return current;
}
