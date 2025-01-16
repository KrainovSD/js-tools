export type NodeRadiusGetterOptions = {
  linkCount: number | undefined;
  flexibleRadius: boolean;
  radiusCoefficient: number;
  radiusFactor: number;
  initialRadius: number;
};

export function nodeRadiusGetter({
  flexibleRadius,
  initialRadius,
  linkCount,
  radiusCoefficient,
  radiusFactor,
}: NodeRadiusGetterOptions) {
  return (
    (flexibleRadius && linkCount ? linkCount / radiusCoefficient : 0) * radiusFactor + initialRadius
  );
}
