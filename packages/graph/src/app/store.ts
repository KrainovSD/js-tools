import { writable } from "svelte/store";
import {
  type ForceSettingsInterface,
  type GraphCanvas,
  type GraphSettingsInterface,
  type LinkOptionsInterface,
  type NodeOptionsInterface,
} from "@/module/GraphCanvas";
import type { Link, LinkData, Node, NodeData } from "./types";

export const nodesStore = writable<Node[]>([]);
export const linksStore = writable<Link[]>([]);
export const graphStore = writable<GraphCanvas<NodeData, LinkData> | undefined>();
export const graphSettingsStore = writable<Partial<GraphSettingsInterface<NodeData>>>({});
export const forceSettingsStore = writable<Partial<ForceSettingsInterface<NodeData, LinkData>>>({});
export const linkSettingsStore = writable<Partial<LinkOptionsInterface<NodeData, LinkData>>>({});
export const nodeSettingsStore = writable<Partial<NodeOptionsInterface<NodeData, LinkData>>>({});
