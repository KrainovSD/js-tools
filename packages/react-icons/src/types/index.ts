import type { CSSProperties } from "react";
import type { Icons } from "../icons";

export interface IconProps {
  color?: string;
  style?: CSSProperties;
  size?: number;
  sizeX?: number;
  sizeY?: number;
  className?: string;
}
export type IconName = keyof typeof Icons;

export type IconCategory = {
  icon: IconName;
  text: string;
  icons: string[];
  id: string;
};
