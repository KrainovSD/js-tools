/* eslint-disable no-console */
import { GraphCanvas, type GraphCanvasInterface } from "@/module/GraphCanvas";
import "./global.css";
import {
  getLinkCount,
  getNodeNeighbors,
  listenDataTools,
  listenForceTools,
  renderTools,
} from "./lib";
import type { LinkData, NodeData } from "./types";

let data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: [],
  nodes: [],
};
const proxy = new Proxy(
  { data },
  {
    get() {
      return data;
    },
    set(target, prop, val) {
      const value = val as Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">;
      getLinkCount(value);
      getNodeNeighbors(value);
      data = value;

      return true;
    },
  },
);

const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: data.links,
  nodes: data.nodes,
  nodeSettings: {
    options: (node) => ({
      text: String(node.data?.name),
    }),
  },
  graphSettings: {
    // stickAfterDrag: true,
    highlightByHover: true,
  },
  linkSettings: {},
  listeners: {
    onSimulationEnd: () => {
      console.log("simulation ended");
    },
    onDoubleClick: (event, node) => {
      console.log("dbclick", node);
    },
    onClick: (event, node) => {
      console.log("onClick", node);
    },
    onWheelClick: (event, node) => {
      console.log("onWheel", node);
    },
    onContextMenu: (event, node) => {
      console.log("onContext", node);
    },
  },
  root,
});

renderTools();
listenForceTools(graph, true);
listenDataTools(graph, proxy, "");
