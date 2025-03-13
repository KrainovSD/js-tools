/* eslint-disable no-bitwise */
/* eslint-disable id-length */
/* eslint-disable no-console */
import {
  GraphCanvas,
  type GraphCanvasInterface,
  type GraphState,
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

let fadingProgress = 0;
const fadingStep = 0.1;

const graph = new GraphCanvas({
  links: data.links,
  nodes: data.nodes,

  nodeSettings: {
    options: (node, index, nodes, state) => {
      const colorStartRgb = { r: 33, g: 37, b: 45 };
      const colorEndRgb = { r: 181, g: 182, b: 185 };
      let color = `rgb(${colorStartRgb.r}, ${colorStartRgb.g}, ${colorStartRgb.b})`;

      if (state?.highlightedNeighbors && state.highlightedNode) {
        if (!state?.highlightedNeighbors.has(node.id) && state?.highlightedNode.id != node.id) {
          /** color */
          const r = colorStartRgb.r + (colorEndRgb.r - colorStartRgb.r) * state.highlightProgress;
          const g = colorStartRgb.g + (colorEndRgb.g - colorStartRgb.g) * state.highlightProgress;
          const b = colorStartRgb.b + (colorEndRgb.b - colorStartRgb.b) * state.highlightProgress;
          color = `rgb(${r}, ${g}, ${b})`;
        }
      }

      return {
        text: String(node.data?.name),
        // highlightFading: true,
        // borderColor: "transparent",
        //  highlightFading: false,
        // color,
      };
    },
  },
  graphSettings: {
    // highlightFadingMin: 0.2,
    zoomExtent: [1, 5],
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

function onDraw(
  state: GraphState<NodeData, LinkData>,
  toggleHighlightStatus: (status: boolean) => void,
  clearHighlightState: () => void,
) {
  function calculateHighlightFading() {
    console.log(fadingProgress);

    toggleHighlightStatus(true);
    if (!state.highlightWorking && fadingProgress > 0) {
      fadingProgress -= fadingStep;

      if (!state.simulationWorking) return void requestAnimationFrame(() => graph.tick());
    }
    if (state.highlightWorking && fadingProgress < 1) {
      fadingProgress += fadingStep;
      if (!state.simulationWorking) return void requestAnimationFrame(() => graph.tick());
    }
    if (!state.highlightWorking && fadingProgress <= 0) clearHighlightState();
    toggleHighlightStatus(false);
  }

  function drawLink(
    this: GraphCanvas<NodeData, LinkData>,
    link: LinkInterface<NodeData, LinkData>,
    index: number,
  ) {
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
      if (
        state.highlightedNode.id != link.source.id &&
        state.highlightedNode.id != link.target.id
      ) {
        alpha =
          state.graphSettings.highlightFadingMin +
          (alpha - state.graphSettings.highlightFadingMin) * (1 - fadingProgress);
      }

      state.context.beginPath();
    }

    state.context.globalAlpha = alpha;
    state.context.strokeStyle = linkOptions.color;
    state.context.lineWidth = linkOptions.width;
    state.context.moveTo(link.source.x, link.source.y);
    state.context.lineTo(link.target.x, link.target.y);

    if (state.highlightedNeighbors && state.highlightedNode) state.context.stroke();
  }

  const drawNode = (textRenders: (() => void)[]) =>
    function drawNode(
      this: GraphCanvas<NodeData, LinkData>,
      node: NodeInterface<NodeData>,
      index: number,
    ) {
      if (!state.context || !node.x || !node.y) return;

      const nodeOptions = nodeIterationExtractor(
        node,
        index,
        state.nodes,
        state,
        state.nodeSettings.options ?? {},
        nodeOptionsGetter,
      );
      const radius =
        nodeRadiusGetter({
          radiusFlexible: state.graphSettings.nodeRadiusFlexible,
          radiusInitial: state.graphSettings.nodeRadiusInitial,
          radiusCoefficient: state.graphSettings.nodeRadiusCoefficient,
          radiusFactor: state.graphSettings.nodeRadiusFactor,
          linkCount: node.linkCount,
        }) ?? nodeOptions.radius;

      const alpha = nodeOptions.alpha;
      const colorStartRgb = { r: 33, g: 37, b: 45 };
      const colorEndRgb = { r: 181, g: 182, b: 185 };
      let color = colorStartRgb;
      if (state.highlightedNeighbors && state.highlightedNode) {
        if (!state.highlightedNeighbors.has(node.id) && state.highlightedNode.id != node.id) {
          const r = colorStartRgb.r + (colorEndRgb.r - colorStartRgb.r) * fadingProgress;
          const g = colorStartRgb.g + (colorEndRgb.g - colorStartRgb.g) * fadingProgress;
          const b = colorStartRgb.b + (colorEndRgb.b - colorStartRgb.b) * fadingProgress;

          color = { b, g, r };
        }
      }

      state.context.beginPath();
      state.context.globalAlpha = 1;

      /** text */
      if (nodeOptions.textVisible && nodeOptions.text) {
        textRenders.push(() => {
          if (!state.context || !node.x || !node.y || !nodeOptions.text) return;

          let alpha = nodeOptions.alpha;
          if (state.highlightedNeighbors && state.highlightedNode) {
            if (!state.highlightedNeighbors.has(node.id) && state.highlightedNode.id != node.id) {
              alpha =
                state.graphSettings.highlightFadingMin +
                (alpha - state.graphSettings.highlightFadingMin) * (1 - fadingProgress);
            }
          }

          state.context.beginPath();
          state.context.globalAlpha = alpha;

          drawText({
            id: node.id,
            cachedNodeText: state.cachedNodeText,
            context: state.context,
            text: nodeOptions.text,
            textAlign: nodeOptions.textAlign,
            textColor: nodeOptions.textColor,
            textFont: nodeOptions.textFont,
            textSize: nodeOptions.textSize,
            x: node.x + nodeOptions.textShiftX,
            y: node.y + radius + nodeOptions.textShiftY,
            maxWidth: nodeOptions.textWidth,
            textStyle: nodeOptions.textStyle,
            textWeight: nodeOptions.textWeight,
            textGap: nodeOptions.textGap,
          });
        });
      }

      /** circle */
      state.context.lineWidth = nodeOptions.borderWidth;
      state.context.strokeStyle = "transparent";
      state.context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
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

// onDraw: (state) => {
//   function drawLink(
//     this: GraphCanvas<NodeData, LinkData>,
//     link: LinkInterface<NodeData, LinkData>,
//     index: number,
//   ) {
//     if (
//       !state.context ||
//       typeof link.source !== "object" ||
//       typeof link.target !== "object" ||
//       !link.source.x ||
//       !link.source.y ||
//       !link.target.x ||
//       !link.target.y
//     )
//       return;

//     const linkOptions = linkIterationExtractor(
//       link,
//       index,
//       state.links,
//       state,
//       state.linkSettings.options ?? {},
//       linkOptionsGetter,
//     );

//     let alpha = linkOptions.alpha;
//     if (state.highlightedNeighbors && state.highlightedNode) {
//       if (
//         state.highlightedNode.id != link.source.id &&
//         state.highlightedNode.id != link.target.id
//       ) {
//         alpha = state.highlighFading;
//       }

//       state.context.beginPath();
//     }

//     state.context.globalAlpha = alpha;
//     state.context.strokeStyle = linkOptions.color;
//     state.context.lineWidth = linkOptions.width;
//     state.context.moveTo(link.source.x, link.source.y);
//     state.context.lineTo(link.target.x, link.target.y);

//     if (state.highlightedNeighbors && state.highlightedNode) state.context.stroke();
//   }

//   const drawNode = (textRenders: (() => void)[]) =>
//     function drawNode(
//       this: GraphCanvas<NodeData, LinkData>,
//       node: NodeInterface<NodeData>,
//       index: number,
//     ) {
//       if (!state.context || !node.x || !node.y) return;

//       const nodeOptions = nodeIterationExtractor(
//         node,
//         index,
//         state.nodes,
//         state,
//         state.nodeSettings.options ?? {},
//         nodeOptionsGetter,
//       );
//       const radius =
//         nodeRadiusGetter({
//           radiusFlexible: state.graphSettings.nodeRadiusFlexible,
//           radiusInitial: state.graphSettings.nodeRadiusInitial,
//           radiusCoefficient: state.graphSettings.nodeRadiusCoefficient,
//           radiusFactor: state.graphSettings.nodeRadiusFactor,
//           linkCount: node.linkCount,
//         }) ?? nodeOptions.radius;

//       let alpha = nodeOptions.alpha;
//       if (state.highlightedNeighbors && state.highlightedNode) {
//         if (!state.highlightedNeighbors.has(node.id) && state.highlightedNode.id != node.id) {
//           alpha = state.highlighFading;
//         }
//       }

//       state.context.beginPath();
//       state.context.globalAlpha = alpha;

//       /** text */
//       if (nodeOptions.textVisible && nodeOptions.text) {
//         textRenders.push(() => {
//           if (!state.context || !node.x || !node.y || !nodeOptions.text) return;
//           state.context.beginPath();
//           state.context.globalAlpha = alpha;

//           drawText({
//             id: node.id,
//             cachedNodeText: state.cachedNodeText,
//             context: state.context,
//             text: nodeOptions.text,
//             textAlign: nodeOptions.textAlign,
//             textColor: nodeOptions.textColor,
//             textFont: nodeOptions.textFont,
//             textSize: nodeOptions.textSize,
//             x: node.x + nodeOptions.textShiftX,
//             y: node.y + radius + nodeOptions.textShiftY,
//             maxWidth: nodeOptions.textWidth,
//             textStyle: nodeOptions.textStyle,
//             textWeight: nodeOptions.textWeight,
//             textGap: nodeOptions.textGap,
//           });
//         });
//       }

//       /** circle */
//       state.context.lineWidth = nodeOptions.borderWidth;
//       state.context.strokeStyle = nodeOptions.borderColor;
//       state.context.fillStyle = nodeOptions.color;
//       state.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

//       state.context.fill();
//       state.context.stroke();
//     };

//   if (!state.context) return;

//   state.context.save();
//   state.context.clearRect(0, 0, state.width, state.height);
//   state.context.translate(state.areaTransform.x, state.areaTransform.y);
//   state.context.scale(state.areaTransform.k, state.areaTransform.k);

//   /** links */
//   state.context.beginPath();
//   state.links.forEach(drawLink);
//   state.context.stroke();

//   /** nodes */
//   const textRenders: (() => void)[] = [];
//   state.nodes.forEach(drawNode(textRenders));
//   textRenders.forEach((render) => render());

//   state.context.restore();
// },
