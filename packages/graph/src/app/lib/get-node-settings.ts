import type { NodeOptionsInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getNodeSettings(opts: Partial<NodeOptionsInterface<NodeData, LinkData>>) {
  return (): NodeOptionsInterface<NodeData, LinkData> => {
    return {
      ...opts,
      textSize: opts.textSize ?? (opts.shape === "text" ? 3.5 : undefined),
    };
  };
}
