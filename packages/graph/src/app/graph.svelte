<script lang="ts">
  import { untrack } from "svelte";
  import Flex from "./flex.svelte";
  import styles from "./graph.module.scss";
  import { isId } from "@krainovsd/js-helpers";
  import type { Link, LinkData, Node, NodeData } from "./types";
  import { graphStore, linksStore, nodesStore } from "./store";
  import type { NodeInterface } from "@/types";
  import { GraphCanvas } from "@/module/GraphCanvas";

  let root = $state<HTMLDivElement | undefined>();

  let nodes: Node[] = $state.raw([]);
  let links: Link[] = $state.raw([]);

  function onClick(event: MouseEvent | TouchEvent, node?: NodeInterface<NodeData> | undefined) {}

  $effect(() => {
    const neighbors: Record<string, string[]> = {};

    const newLinks: Link[] = $linksStore.map((link) => {
      const sourceId =
        typeof link.source === "object" && "id" in link.source ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" && "id" in link.target ? link.target.id : link.target;

      if (isId(sourceId) && isId(targetId)) {
        if (!neighbors[sourceId.toString()]) neighbors[sourceId.toString()] = [];
        const prevSource = neighbors[sourceId.toString()];
        prevSource.push(targetId.toString());

        if (!neighbors[targetId.toString()]) neighbors[targetId.toString()] = [];
        const prevTarget = neighbors[targetId.toString()];
        prevTarget.push(sourceId.toString());
      }

      return link;
    });

    const newNodes: Node[] = $nodesStore.map((node) => {
      const nodeNeighbor = neighbors[node.id.toString()] ?? [];

      node.neighbors = nodeNeighbor;
      node.linkCount = nodeNeighbor.length;

      return node;
    });

    nodes = newNodes;
    links = newLinks;
  });

  $effect(() => {
    nodes;
    links;
    let graphInstance = untrack(() => $graphStore);
    console.log("update data");

    if (graphInstance) {
      const { links: gLinks, nodes: gNodes } = graphInstance.getData();
      if (gLinks === links && gNodes === nodes) return;
      graphInstance.changeData({ links, nodes }, 0.2);
    }
  });

  /** init graph */
  $effect(() => {
    let graphInstance = untrack(() => $graphStore);
    console.log("init", graphInstance);

    if (root && !graphInstance) {
      graphInstance = new GraphCanvas<NodeData, LinkData>({
        links: untrack(() => links),
        nodes: untrack(() => nodes),
        root,
        listeners: {
          onClick: untrack(() => onClick),
          onDoubleClick: (event, node) => {
            console.log({ ...graphInstance?.getData?.(), node });
          },
          onSimulationEnd: () => {
            console.log("simulation end");
          },
        },
      }) as GraphCanvas<NodeData, LinkData>;
      graphStore.set(graphInstance);
    }
    return () => {
      if (graphInstance) {
        graphInstance.destroy();
        graphInstance = undefined;
        graphStore.set(undefined);
      }
    };
  });
</script>

<Flex class={styles.container} wide full>
  <Flex class={styles.graph} wide full bind:instance={root}></Flex>
</Flex>
