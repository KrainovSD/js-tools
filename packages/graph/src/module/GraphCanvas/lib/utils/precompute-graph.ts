import { GraphCanvas } from "../../GraphCanvas";
import type {
  ForceSettingsInterface,
  LinkInterface,
  LinkSettingsInterface,
  NodeInterface,
  NodeSettingsInterface,
} from "../../types";

type PrecomputeGraphOptions<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
> = {
  nodes: NodeInterface<NodeData>[];
  links: LinkInterface<NodeData, LinkData>[];
  forceSettings: ForceSettingsInterface<NodeData, LinkData>;
  nodeSettings: NodeSettingsInterface<NodeData, LinkData>;
  linkSettings: LinkSettingsInterface<NodeData, LinkData>;
};
export async function precomputeGraph<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(opts: PrecomputeGraphOptions<NodeData, LinkData>) {
  const div = document.createElement("div");
  const graph = new GraphCanvas({
    root: div,
    nodes: opts.nodes,
    links: opts.links,
    nodeSettings: opts.nodeSettings,
    linkSettings: opts.linkSettings,
    forceSettings: opts.forceSettings,
  });
  await graph.precompute();
  graph.destroy();
}
