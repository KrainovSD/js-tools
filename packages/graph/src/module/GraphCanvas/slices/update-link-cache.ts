import type { GraphCanvas } from "../GraphCanvas";
import { extractLinkPointIds, linkIterationExtractor, linkOptionsGetter } from "../lib";

export function updateLinkCache<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  this.linkOptionsCache = {};

  const groupMap: Record<string, number> = {};
  const groupSelfMap: Record<string, number> = {};
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

    if (this.linkSettings.curve) {
      if (sourceId === targetId) {
        groupSelfMap[id] ??= 0;
        link._groupIndex = ++groupSelfMap[id];
        link._self = true;
        continue;
      }
      const reverseId = `${sourceId}${targetId}`;
      groupMap[reverseId] ??= 0;
      groupMap[reverseId]++;
      groupMap[id] ??= 0;
      link._groupIndex = indexToPosition(++groupMap[id]);
      link._self = false;
    }
  }
  if (this.linkSettings.curve) {
    for (const link of this.links) {
      const { sourceId, targetId } = extractLinkPointIds(link);
      const id = `${targetId}${sourceId}`;
      link._groupSize = link._self ? (groupSelfMap[id] ?? 1) : (groupMap[id] ?? 1);
    }
  }
}

function indexToPosition(n: number): number {
  if (n === 1) return 0;

  const index = n >> 1;
  return n & 1 ? -(index * 2) : index * 2;

  // return n & 1 ? -(n >> 1) : n >> 1;
}
