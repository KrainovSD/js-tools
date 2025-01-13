import type { NodeInterface } from "@/types";

export function nodeIdGetter<NodeData extends Record<string, unknown>>(d: NodeInterface<NodeData>) {
  return d.id;
}
