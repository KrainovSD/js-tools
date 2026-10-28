import type { EditorState } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";
import type { MermaidConfig } from "mermaid";
import type mermaid from "mermaid";
import { randomString } from "@/lib/utils";
import { NAME_OF_CODE_INFO, NAME_OF_CODE_TEXT, NAME_OF_MERMAID } from "../markdown-model";
import type { MermaidModel } from "./mermaid-model";

type MermaidInstance = typeof mermaid;

const MAX_CACHED_SVG = 20;

const svgCache = new Map<string, string>();
const renderPromises = new Map<string, Promise<string>>();

export function renderMermaidDiagram(
  source: string,
  width: number,
  fontFamily: string,
  config: MermaidConfig | undefined,
): Promise<string> {
  const cached = svgCache.get(source);
  if (cached !== undefined) return Promise.resolve(cached);
  const inFlight = renderPromises.get(source);
  if (inFlight) return inFlight;
  const promise = document.fonts.ready
    .then(() => loadMermaid(fontFamily, config))
    .then((instance) => {
      const id = `m${randomString(15)}`;
      const temp = document.createElement("div");
      temp.style.width = `${width}px`;
      temp.style.visibility = "hidden";
      temp.style.position = "absolute";
      document.body.appendChild(temp);
      return instance.render(id, source, temp).then(
        (result) => {
          temp.remove();
          svgCache.set(source, result.svg);
          if (svgCache.size > MAX_CACHED_SVG) {
            const oldest = svgCache.keys().next().value;
            if (oldest !== undefined) svgCache.delete(oldest);
          }
          return result.svg;
        },
        (error: unknown) => {
          temp.remove();
          throw error;
        },
      );
    });
  renderPromises.set(source, promise);
  promise.then(
    () => renderPromises.delete(source),
    () => renderPromises.delete(source),
  );
  return promise;
}

let mermaidPromise: Promise<MermaidInstance> | undefined;

function loadMermaid(
  fontFamily: string,
  config: MermaidConfig | undefined,
): Promise<MermaidInstance> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: instance }) => {
      instance.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        themeVariables: { fontFamily },
        flowchart: { useMaxWidth: false },
        sequence: { useMaxWidth: false },
        er: { useMaxWidth: false },
        gantt: { useMaxWidth: true },
        journey: { useMaxWidth: true },
        class: { useMaxWidth: true },
        state: { useMaxWidth: true },
        pie: { useMaxWidth: true },
        ...config,
      });
      return instance;
    });
    mermaidPromise.catch(() => {
      mermaidPromise = undefined;
    });
  }
  return mermaidPromise;
}

export function namespaceMarkers(root: Element, id: string) {
  const markers = root.querySelectorAll("marker[id]");
  for (const marker of markers) {
    const currentId = marker.id;
    const nextId = `${id}-${currentId}`;
    marker.id = nextId;
    const references = root.querySelectorAll<SVGElement>(
      `[marker-start="url(#${currentId})"], [marker-end="url(#${currentId})"]`,
    );
    for (const reference of references) {
      if (reference.getAttribute("marker-start") === `url(#${currentId})`) {
        reference.setAttribute("marker-start", `url(#${nextId})`);
      }
      if (reference.getAttribute("marker-end") === `url(#${currentId})`) {
        reference.setAttribute("marker-end", `url(#${nextId})`);
      }
    }
  }
}

export function isMermaidBlock(state: EditorState, node: SyntaxNode): boolean {
  return parseMermaid(state, node)?.replaceable ?? false;
}

export function resolveFontFamily(element: HTMLElement): string {
  const styles = getComputedStyle(element);
  const font = styles.getPropertyValue("--ksd-cm-font").trim();
  return font || styles.fontFamily || "sans-serif";
}

export function parseMermaid(state: EditorState, node: SyntaxNode): MermaidModel | undefined {
  const info = node.getChild(NAME_OF_CODE_INFO);
  if (!info) return undefined;
  if (state.doc.sliceString(info.from, info.to) !== NAME_OF_MERMAID) return undefined;
  const codeText = node.getChild(NAME_OF_CODE_TEXT);
  const firstLine = state.doc.lineAt(node.from);
  const lastLine = state.doc.lineAt(node.to);
  const firstTriggerLine =
    firstLine.number === 1 ? firstLine : state.doc.line(firstLine.number - 1);
  const lastTriggerLine =
    lastLine.number === state.doc.lines ? lastLine : state.doc.line(lastLine.number + 1);
  return {
    from: node.from,
    to: node.to,
    source: codeText ? state.doc.sliceString(codeText.from, codeText.to) : "",
    replaceable: node.from === firstLine.from && node.to === lastLine.to,
    triggerFrom: firstTriggerLine.from,
    triggerTo: lastTriggerLine.to,
  };
}
