/* eslint-disable no-console */
import { colorToRgb, extractRgb, fadeRgb, rgbAnimationByProgress } from "@/lib";
import {
  GraphCanvas,
  type GraphCanvasInterface,
  type GraphState,
  calculateLinkPositionByRadius,
  drawText,
  linkIterationExtractor,
  linkOptionsGetter,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
} from "@/module/GraphCanvas";
import type { LinkInterface, NodeInterface } from "@/types";
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
    options: () => {
      return {
        highlightFading: true,
        highlightColor: false,
      };
    },
  },
  graphSettings: {
    // highlightFadingMin: 0.2,
    zoomExtent: [0.1, 5],
    zoomInitial: { k: 1 },
    // stickAfterDrag: true,
    highlightByHover: true,
    // zoomInitial: {
    //   k: 3.031433133020798,
    //   x: 636.0638355589793,
    //   y: 1007.7976358047551,
    // },
  },
  forceSettings: {
    collideOn: true,
  },
  linkSettings: {
    options: () => {
      return {};
    },
  },
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
    onZoom: () => {
      // console.log({ k: event.transform.k, x: event.transform.x, y: event.transform.y });
    },
    // onDraw,
  },
  root,
});

renderTools();
listenForceTools(graph, true);
listenDataTools(graph, proxy, "d3");

let fadingProgress = 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDraw(
  state: GraphState<NodeData, LinkData>,
  toggleHighlightStatus: (status: boolean) => void,
  clearHighlightState: () => void,
) {
  function calculateHighlightFading() {
    toggleHighlightStatus(true);
    if (!state.highlightWorking && fadingProgress > 0) {
      fadingProgress -= state.graphSettings.highlightDownStep;

      if (!state.simulationWorking) return void requestAnimationFrame(() => graph.tick());
    }
    if (state.highlightWorking && fadingProgress < 1) {
      fadingProgress += state.graphSettings.highlightUpStep;
      if (!state.simulationWorking) return void requestAnimationFrame(() => graph.tick());
    }
    if (!state.highlightWorking && fadingProgress <= 0) clearHighlightState();
    toggleHighlightStatus(false);
  }

  function drawLink(link: LinkInterface<NodeData, LinkData>, index: number) {
    if (
      !state.context ||
      typeof link.source !== "object" ||
      typeof link.target !== "object" ||
      !link.source.x ||
      !link.source.y ||
      !link.target.x ||
      !link.target.y
    )
      return;

    const linkOptions = linkIterationExtractor(
      link,
      index,
      state.links,
      state,
      state.linkSettings.options ?? {},
      linkOptionsGetter,
    );

    let alpha = linkOptions.alpha;
    if (state.highlightedNeighbors && state.highlightedNode) {
      /** Not highlighted */
      if (
        state.highlightedNode.id != link.source.id &&
        state.highlightedNode.id != link.target.id
      ) {
        if (linkOptions.highlightFading)
          alpha =
            state.graphSettings.highlightFadingMin +
            (alpha - state.graphSettings.highlightFadingMin) * (1 - fadingProgress);
      }

      state.context.beginPath();
    }

    state.context.globalAlpha = alpha;
    state.context.strokeStyle = linkOptions.color;
    state.context.lineWidth = linkOptions.width;
    if (linkOptions.pretty) {
      const { x1, x2, y1, y2 } = calculateLinkPositionByRadius(link) ?? {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      };

      state.context.moveTo(x1, y1);
      state.context.lineTo(x2, y2);
    } else {
      state.context.moveTo(link.source.x, link.source.y);
      state.context.lineTo(link.target.x, link.target.y);
    }

    if (state.highlightedNeighbors && state.highlightedNode) state.context.stroke();
  }

  const drawNode = (textRenders: (() => void)[]) =>
    function drawNode(node: NodeInterface<NodeData>, index: number) {
      if (!state.context || !node.x || !node.y) return;

      const nodeOptions = nodeIterationExtractor(
        node,
        index,
        state.nodes,
        state,
        state.nodeSettings.options ?? {},
        nodeOptionsGetter,
      );

      let alpha = nodeOptions.alpha;
      let color = nodeOptions.color;
      let radiusInitial = nodeOptions.radius ?? state.graphSettings.nodeRadiusInitial;
      let textAlpha = nodeOptions.textAlpha;
      let textSize = nodeOptions.textSize;
      let textShiftX = nodeOptions.textShiftX;
      let textShiftY = nodeOptions.textShiftY;
      let textWeight = nodeOptions.textWeight;
      let textWidth = nodeOptions.textWidth;
      if (state.highlightedNeighbors && state.highlightedNode) {
        /** Not highlighted */
        if (!state.highlightedNeighbors.has(node.id) && state.highlightedNode.id != node.id) {
          if (nodeOptions.highlightFading) {
            alpha =
              state.graphSettings.highlightFadingMin +
              (alpha - state.graphSettings.highlightFadingMin) * (1 - fadingProgress);
          }
          if (nodeOptions.highlightTextFading) {
            textAlpha =
              state.graphSettings.highlightTextFadingMin +
              (textAlpha - state.graphSettings.highlightTextFadingMin) * (1 - fadingProgress);
          }
          if (nodeOptions.highlightColor) {
            const colorRgb = extractRgb(colorToRgb(color));
            if (colorRgb) {
              const colorRgbFade = fadeRgb(colorRgb, 0.15);
              const colorFadeAnimation = rgbAnimationByProgress(
                colorRgb,
                colorRgbFade,
                fadingProgress,
              );
              color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
            }
          }
        } else if (
          !state.graphSettings.highlightOnlyRoot ||
          (state.graphSettings.highlightOnlyRoot && state.highlightedNode.id === node.id)
        ) {
          /** Highlighted */
          if (nodeOptions.highlightSizing) {
            const radiusMax = radiusInitial + state.graphSettings.highlightSizingAdditional;
            radiusInitial += ((radiusMax - radiusInitial) / 100) * (fadingProgress * 100);
          }
          if (nodeOptions.highlightTextSizing) {
            const textSizeMax = textSize + state.graphSettings.highlightTextSizingAdditional;
            const textShiftXMax = textShiftX + state.graphSettings.highlightTextShiftXAdditional;
            const textShiftYMax = textShiftY + state.graphSettings.highlightTextShiftYAdditional;
            const textWeightMax = textWeight + state.graphSettings.highlightTextWeightAdditional;
            const textWidthMax = textWidth + state.graphSettings.highlightTextWidthAdditional;

            textSize += ((textSizeMax - textSize) / 100) * (fadingProgress * 100);
            textShiftX += ((textShiftXMax - textShiftX) / 100) * (fadingProgress * 100);
            textShiftY += ((textShiftYMax - textShiftY) / 100) * (fadingProgress * 100);
            textWeight += ((textWeightMax - textWeight) / 100) * (fadingProgress * 100);
            textWidth += ((textWidthMax - textWidth) / 100) * (fadingProgress * 100);
          }
        }
      }

      const radius = nodeRadiusGetter({
        radiusFlexible: state.graphSettings.nodeRadiusFlexible,
        radiusInitial,
        radiusCoefficient: state.graphSettings.nodeRadiusCoefficient,
        radiusFactor: state.graphSettings.nodeRadiusFactor,
        linkCount: node.linkCount,
      });

      node._radius = radius;

      state.context.beginPath();
      state.context.globalAlpha = alpha;

      /** text */
      if (nodeOptions.textVisible && nodeOptions.text) {
        textRenders.push(() => {
          if (!state.context || !node.x || !node.y || !nodeOptions.text) return;
          state.context.beginPath();
          state.context.globalAlpha = textAlpha;

          drawText({
            id: node.id,
            cachedNodeText: state.cachedNodeText,
            context: state.context,
            text: nodeOptions.text,
            textAlign: nodeOptions.textAlign,
            textColor: nodeOptions.textColor,
            textFont: nodeOptions.textFont,
            textSize,
            x: node.x + textShiftX,
            y: node.y + radius + textShiftY,
            maxWidth: textWidth,
            textStyle: nodeOptions.textStyle,
            textWeight,
            textGap: nodeOptions.textGap,
          });
        });
      }

      /** circle */
      state.context.lineWidth = nodeOptions.borderWidth;
      state.context.strokeStyle = nodeOptions.borderColor;
      state.context.fillStyle = color;
      state.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

      state.context.fill();
      state.context.stroke();
    };

  if (!state.context) return;

  state.context.save();
  state.context.clearRect(0, 0, state.width, state.height);
  state.context.translate(state.areaTransform.x, state.areaTransform.y);
  state.context.scale(state.areaTransform.k, state.areaTransform.k);

  /** links */
  state.context.beginPath();
  state.links.forEach(drawLink);
  state.context.stroke();

  /** nodes */
  const textRenders: (() => void)[] = [];
  state.nodes.forEach(drawNode(textRenders));
  textRenders.forEach((render) => render());

  state.context.restore();

  calculateHighlightFading();
}
