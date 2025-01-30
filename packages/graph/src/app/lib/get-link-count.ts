import type { GraphCanvasInterface } from "@/module/GraphCanvas";
import type { LinkData, NodeData } from "../types";

export function getLinkCount(
  data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">,
) {
  const counter: Record<string, number> = {};

  for (const link of data.links) {
    [link.source, link.target].forEach((node) => {
      const id = typeof node === "object" ? node.id : node;

      const prev = counter[id];
      if (prev == undefined) counter[id] = 1;
      else counter[id] = prev + 1;
    });
  }

  for (const node of data.nodes) {
    node.linkCount = counter[node.id];
  }
}
