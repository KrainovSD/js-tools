import type { LinkInterface, NodeInterface } from "@/module/GraphCanvas";
import type { GraphSettingsInputInterface } from "@/types";
import type {
  ForceSettingsInterface,
  GraphSettingsInterface,
  HighlightSettingsInterface,
  LinkOptionsInterface,
  LinkSettingsInterface,
  NodeOptionsInterface,
  NodeSettingsInterface,
} from "../module/GraphCanvas";

export type NodeData = {
  image?: string;
};
export type LinkData = {
  id?: string;
};

export type Link = LinkInterface<NodeData, LinkData>;
export type Node = NodeInterface<NodeData>;
export type Graph = {
  nodes: Node[];
  links: Link[];
};
export type GraphSettings = {
  forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>>;
  graphSettings: Partial<GraphSettingsInterface<NodeData>>;
  linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>>;
  nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>>;
  linkSettings: Partial<LinkSettingsInterface<NodeData, LinkData>>;
  nodeSettings: Partial<NodeSettingsInterface<NodeData, LinkData>>;
  highlightSettings: Partial<HighlightSettingsInterface>;
};

export type SettingsTemplateDiffInfo = {
  name: keyof GraphSettings;
  keys: string[];
};

type SettingsTemplateChildInterface = {
  id: string;
  label: string;
  open: boolean;
  inputs: GraphSettingsInputInterface<string>[];
  diffInfo: SettingsTemplateDiffInfo[];
  name: keyof GraphSettings;
};
type SettingsTemplateParentInterface = {
  id: string;
  label: string;
  open: boolean;
  diffInfo: SettingsTemplateDiffInfo[];
  children: SettingsTemplateInterface[];
};
export type SettingsTemplateInterface =
  | SettingsTemplateChildInterface
  | SettingsTemplateParentInterface;
