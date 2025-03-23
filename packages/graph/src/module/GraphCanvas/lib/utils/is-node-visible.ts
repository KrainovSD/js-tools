import type { ZoomTransform } from "d3-zoom";

type IsNodeVisibleOptions = {
  x: number;
  y: number;
  radius: number;
  width: number;
  height: number;
  transform: ZoomTransform;
};

const ADDITIONAL_VIEWPORT = 10;

export function isNodeVisible(opts: IsNodeVisibleOptions) {
  const left = -opts.transform.x / opts.transform.k;
  const right = (opts.width - opts.transform.x) / opts.transform.k;
  const top = -opts.transform.y / opts.transform.k;
  const bottom = (opts.height - opts.transform.y) / opts.transform.k;

  return (
    left < opts.x + opts.radius + ADDITIONAL_VIEWPORT &&
    opts.x - opts.radius - ADDITIONAL_VIEWPORT < right &&
    top < opts.y + opts.radius + ADDITIONAL_VIEWPORT &&
    opts.y - opts.radius - ADDITIONAL_VIEWPORT < bottom
  );
}
