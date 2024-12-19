import { getUniqueId } from "../../lib";
import type { IconProps } from "../../types";

const CLIP_PATH_ID = getUniqueId();

export function Arrow(props: IconProps): React.JSX.Element {
  const { sizeX = 14, sizeY = 14, color = "#FFFFFF", ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath={`url(#${CLIP_PATH_ID})`}>
        <path
          d="M8.00033 2.66663L7.06033 3.60663L10.7803 7.33329H2.66699V8.66663H10.7803L7.06033 12.3933L8.00033 13.3333L13.3337 7.99996L8.00033 2.66663Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id={CLIP_PATH_ID}>
          <rect width={sizeX} height={sizeY} fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
}
