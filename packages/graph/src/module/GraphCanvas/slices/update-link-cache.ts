import type { GraphCanvas } from "../GraphCanvas";
import { extractLinkPointIds, linkIterationExtractor, linkOptionsGetter } from "../lib";

export function updateLinkCache<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  this.linkOptionsCache = {};

  for (let i = 0; i < this.links.length; i++) {
    const link = this.links[i];
    const { sourceId, targetId } = extractLinkPointIds(link);

    const linkOptions = linkIterationExtractor(
      link,
      i,
      this.links,
      this,
      this.linkSettings.options ?? {},
      linkOptionsGetter,
    );
    const id = `${targetId}${sourceId}`;
    this.linkOptionsCache[id] = linkOptions;
  }
}
