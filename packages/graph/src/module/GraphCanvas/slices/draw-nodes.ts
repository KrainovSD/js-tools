import { isNumber } from "@krainovsd/js-helpers";
import { colorToRgb, extractRgb, fadeRgb, rgbAnimationByProgress } from "@/lib";
import type { NodeInterface } from "@/types";
import type { GraphCanvas } from "../GraphCanvas";
import {
  animationByProgress,
  isNodeVisible,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
  nodeSizeGetter,
} from "../lib";
import type { GraphState, NodeOptionsInterface } from "../types";
import { drawText, getTextLines } from "./draw-text";

export function getDrawNode<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(nodeRenders: (() => void)[], textRenders: (() => void)[], state: GraphState<NodeData, LinkData>) {
  return function drawNode(
    this: GraphCanvas<NodeData, LinkData>,
    node: NodeInterface<NodeData>,
    index: number,
  ) {
    if (!this.context || !node.x || !node.y) return;

    let nodeOptions: Required<NodeOptionsInterface<NodeData, LinkData>>;
    if (this.nodeSettings.cache && this.nodeOptionsCache[node.id]) {
      nodeOptions = this.nodeOptionsCache[node.id];
    } else {
      nodeOptions = nodeIterationExtractor(
        node,
        index,
        this.nodes,
        state,
        this.nodeSettings.options ?? {},
        nodeOptionsGetter,
      );
      if (this.nodeSettings.cache) {
        this.nodeOptionsCache[node.id] = nodeOptions;
      }
    }

    if (nodeOptions.nodeDraw && nodeOptions.textDraw) {
      nodeRenders.push(() => {
        nodeOptions?.nodeDraw?.(node, nodeOptions, state);
      });

      textRenders.push(() => {
        nodeOptions?.textDraw?.(node, nodeOptions, state);
      });

      return;
    }

    let alpha = nodeOptions.alpha;
    let color = nodeOptions.color;
    let radiusInitial = nodeOptions.radius;
    let widthInitial = nodeOptions.width;
    let heightInitial = nodeOptions.height;
    let textAlpha = nodeOptions.textAlpha;
    let textSize = nodeOptions.textSize;
    let textShiftX = nodeOptions.textShiftX;
    let textShiftY = nodeOptions.textShiftY;
    let textWeight = nodeOptions.textWeight;
    let textWidth = nodeOptions.textWidth;
    let sizeCoefficient = 1;
    /** Node Highlight */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** Not highlighted */
      if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
        if (this.nodeSettings.highlightByNodeNodeFading) {
          const min =
            this.nodeSettings.highlightByNodeNodeFadingMin < alpha
              ? this.nodeSettings.highlightByNodeNodeFadingMin
              : alpha;
          alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
        }
        if (this.nodeSettings.highlightByNodeTextFading) {
          const min =
            this.nodeSettings.highlightByNodeTextFadingMin < textAlpha
              ? this.nodeSettings.highlightByNodeTextFadingMin
              : textAlpha;
          textAlpha = animationByProgress(min, textAlpha - min, 1 - this.highlightProgress);
        }
        if (this.nodeSettings.highlightByNodeNodeColor) {
          const colorRgb = extractRgb(colorToRgb(color));
          if (colorRgb) {
            const colorRgbFade = fadeRgb(
              colorRgb,
              this.nodeSettings.highlightByNodeNodeColorFadingMin,
            );
            const colorFadeAnimation = rgbAnimationByProgress(
              colorRgb,
              colorRgbFade,
              this.highlightProgress,
            );
            color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
          }
        }
      } else if (
        !this.nodeSettings.highlightByNodeOnlyRoot ||
        (this.nodeSettings.highlightByNodeOnlyRoot && this.highlightedNode.id === node.id)
      ) {
        /** Highlighted */

        if (this.nodeSettings.highlightByNodeNodeSizing && nodeOptions.shape === "circle") {
          radiusInitial = animationByProgress(
            radiusInitial,
            this.nodeSettings.highlightByNodeNodeSizingAdditional,
            this.highlightProgress,
          );
        }
        if (
          this.nodeSettings.highlightByNodeNodeSizing &&
          (nodeOptions.shape === "square" || nodeOptions.shape === "text")
        ) {
          sizeCoefficient = animationByProgress(
            sizeCoefficient,
            this.nodeSettings.highlightByNodeNodeSizingAdditionalCoefficient,
            this.highlightProgress,
          );

          widthInitial *= sizeCoefficient;
          heightInitial *= sizeCoefficient;
        }
        if (this.nodeSettings.highlightByNodeTextSizing) {
          textSize = animationByProgress(
            textSize,
            this.nodeSettings.highlightByNodeTextSizingAdditional,
            this.highlightProgress,
          );
          textShiftX = animationByProgress(
            textShiftX,
            this.nodeSettings.highlightByNodeTextShiftXAdditional,
            this.highlightProgress,
          );
          textShiftY = animationByProgress(
            textShiftY,
            this.nodeSettings.highlightByNodeTextShiftYAdditional,
            this.highlightProgress,
          );
          textWeight = animationByProgress(
            textWeight,
            this.nodeSettings.highlightByNodeTextWeightAdditional,
            this.highlightProgress,
          );
          textWidth = animationByProgress(
            textWidth,
            this.nodeSettings.highlightByNodeTextWidthAdditional,
            this.highlightProgress,
          );
        }
      }
    }
    /** LinkHighlight */
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** Not highlighted */
      if (
        !this.highlightedNeighbors.has(node.id) &&
        this.highlightedLink.source !== node &&
        this.highlightedLink.target !== node
      ) {
        if (this.nodeSettings.highlightByLinkNodeFading) {
          const min =
            this.nodeSettings.highlightByLinkNodeFadingMin < alpha
              ? this.nodeSettings.highlightByLinkNodeFadingMin
              : alpha;
          alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
        }
        if (this.nodeSettings.highlightByLinkTextFading) {
          const min =
            this.nodeSettings.highlightByLinkTextFadingMin < textAlpha
              ? this.nodeSettings.highlightByLinkTextFadingMin
              : textAlpha;
          textAlpha = animationByProgress(min, textAlpha - min, 1 - this.highlightProgress);
        }
        if (this.nodeSettings.highlightByLinkNodeColor) {
          const colorRgb = extractRgb(colorToRgb(color));
          if (colorRgb) {
            const colorRgbFade = fadeRgb(
              colorRgb,
              this.nodeSettings.highlightByLinkNodeColorFadingMin,
            );
            const colorFadeAnimation = rgbAnimationByProgress(
              colorRgb,
              colorRgbFade,
              this.highlightProgress,
            );
            color = `rgb(${colorFadeAnimation.r}, ${colorFadeAnimation.g}, ${colorFadeAnimation.b})`;
          }
        }
      } else {
        /** Highlighted */

        if (this.nodeSettings.highlightByLinkNodeSizing && nodeOptions.shape === "circle") {
          radiusInitial = animationByProgress(
            radiusInitial,
            this.nodeSettings.highlightByLinkNodeSizingAdditional,
            this.highlightProgress,
          );
        }
        if (
          this.nodeSettings.highlightByLinkNodeSizing &&
          (nodeOptions.shape === "square" ||
            nodeOptions.shape === "text" ||
            nodeOptions.shape === "icon")
        ) {
          sizeCoefficient = animationByProgress(
            sizeCoefficient,
            this.nodeSettings.highlightByNodeNodeSizingAdditionalCoefficient,
            this.highlightProgress,
          );

          widthInitial *= sizeCoefficient;
          heightInitial *= sizeCoefficient;
        }
        if (this.nodeSettings.highlightByLinkTextSizing) {
          textSize = animationByProgress(
            textSize,
            this.nodeSettings.highlightByLinkTextSizingAdditional,
            this.highlightProgress,
          );
          textShiftX = animationByProgress(
            textShiftX,
            this.nodeSettings.highlightByLinkTextShiftXAdditional,
            this.highlightProgress,
          );
          textShiftY = animationByProgress(
            textShiftY,
            this.nodeSettings.highlightByLinkTextShiftYAdditional,
            this.highlightProgress,
          );
          textWeight = animationByProgress(
            textWeight,
            this.nodeSettings.highlightByLinkTextWeightAdditional,
            this.highlightProgress,
          );
          textWidth = animationByProgress(
            textWidth,
            this.nodeSettings.highlightByLinkTextWidthAdditional,
            this.highlightProgress,
          );
        }
      }
    }

    /** Flex radius */
    const radius =
      nodeOptions.shape === "circle"
        ? nodeRadiusGetter({
            radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
            radiusInitial,
            radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
            radiusFactor: this.nodeSettings.nodeRadiusFactor,
            linkCount: node.linkCount,
          })
        : radiusInitial;
    /** Flex size */
    let height: number = heightInitial;
    let width: number = widthInitial;
    if (nodeOptions.shape === "square") {
      const size = nodeSizeGetter({
        heightInitial,
        widthInitial,
        linkCount: node.linkCount,
        sizeCoefficient: this.nodeSettings.nodeSizeCoefficient,
        sizeFactor: this.nodeSettings.nodeSizeFactor,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
      });
      width = size.width;
      height = size.height;
    }
    if (nodeOptions.shape === "text") {
      width = nodeOptions.width;

      const size = nodeSizeGetter({
        heightInitial,
        widthInitial: width,
        linkCount: node.linkCount,
        sizeCoefficient: this.nodeSettings.nodeSizeCoefficient,
        sizeFactor: this.nodeSettings.nodeSizeFactor,
        sizeFlexible: this.nodeSettings.nodeSizeFlexible,
      });
      width = size.width;
      textSize *= size.additionalSizeCoefficient;
    }
    /** Size by text in textNode */
    if (nodeOptions.shape === "text" && nodeOptions.text) {
      textWidth = width;
      let lines: string[];
      let maxWidths: [number, number];

      const cachedLines = this.cachedNodeText[node.id];
      const cachedMaxWidths = this.cachedNodeTextMaxWidths[node.id];
      if (cachedLines && cachedMaxWidths != undefined) {
        lines = cachedLines;
        maxWidths = cachedMaxWidths;
      } else {
        const textInfo = getTextLines({
          context: this.context,
          text: nodeOptions.text,
          textAlign: nodeOptions.textAlign,
          textColor: nodeOptions.textColor,
          textFont: nodeOptions.textFont,
          textSize,
          maxWidth: textWidth,
          textStyle: nodeOptions.textStyle,
          textWeight,
        });
        maxWidths = [textInfo.currentMaxSize, textWidth];
        lines = textInfo.lines;
        this.cachedNodeText[node.id] = lines;
        this.cachedNodeTextMaxWidths[node.id] = maxWidths;
      }

      const textSizeCoefficient = textSize / nodeOptions.textSize;
      const maxSizeDiff = maxWidths[0] * textSizeCoefficient;

      height =
        lines.length * textSize +
        (lines.length - 1) * nodeOptions.textGap +
        nodeOptions.textNodeYPadding;

      width = maxSizeDiff + nodeOptions.textNodeXPadding;
    }

    /** Node parameters */
    node._radius = radius;
    node._width = width;
    node._height = height;
    node._borderRadius =
      isNumber(nodeOptions.borderRadius) && nodeOptions.borderRadius > 0
        ? Math.min(nodeOptions.borderRadius, nodeOptions.width / 2, nodeOptions.height / 2)
        : 0;
    node._shape = nodeOptions.shape ?? "circle";

    /** Node Visibility */
    if (
      !isNodeVisible({
        height: this.height,
        width: this.width,
        transform: this.areaTransform,
        node,
      })
    ) {
      node._visible = false;

      return;
    }
    node._visible = true;

    /** Node draw */
    nodeRenders.push(() => {
      if (!this.context || !node.x || !node.y) return;

      this.context.beginPath();
      this.context.globalAlpha = alpha;
      this.context.lineWidth = nodeOptions.borderWidth;
      this.context.strokeStyle = nodeOptions.borderColor;
      this.context.fillStyle = color;

      switch (nodeOptions.shape) {
        case "circle": {
          this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          break;
        }
        case "square": {
          this.context.roundRect(
            node.x - width / 2,
            node.y - height / 2,
            width,
            height,
            node._borderRadius,
          );
          break;
        }
        case "text": {
          if (this.nodeSettings.textNodeDebug) {
            this.context.strokeRect(node.x - width / 2, node.y - height / 2, width, height);
          }

          const lines = this.cachedNodeText[node.id];
          if (nodeOptions.text && lines)
            drawText({
              id: node.id,
              cachedNodeText: this.cachedNodeText,
              context: this.context,
              text: nodeOptions.text,
              textAlign: nodeOptions.textAlign,
              textColor: nodeOptions.textColor,
              textFont: nodeOptions.textFont,
              textSize,
              x: node.x,
              y: node.y + textSize / 4 - (lines.length - 1) * (textSize / 2),
              maxWidth: textWidth,
              textStyle: nodeOptions.textStyle,
              textWeight,
              textGap: nodeOptions.textGap,
            });
          break;
        }
        default: {
          this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          break;
        }
      }

      this.context.fill();
      this.context.stroke();
    });

    if (nodeOptions.nodeExtraDraw) {
      nodeRenders.push(() => {
        nodeOptions?.nodeExtraDraw?.(
          node,
          {
            ...nodeOptions,
            radius,
            alpha,
            color,
            textAlpha,
            textSize,
            textShiftX,
            textShiftY,
            textWeight,
            textWidth,
          },
          state,
        );
      });
    }

    /** Text draw */
    if (nodeOptions.textVisible && nodeOptions.text && nodeOptions.shape !== "text") {
      textRenders.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw(
            node,
            {
              ...nodeOptions,
              radius,
              alpha,
              color,
              textAlpha,
              textSize,
              textShiftX,
              textShiftY,
              textWeight,
              textWidth,
            },
            state,
          );

          return;
        }

        if (!this.context || !node.x || !node.y || !nodeOptions.text) return;
        this.context.beginPath();
        this.context.globalAlpha = textAlpha;

        let y = node.y + textShiftY;
        if (nodeOptions.shape === "circle") {
          y += radius;
        }
        if (nodeOptions.shape === "square") {
          y += height / 2;
        }

        drawText({
          id: node.id,
          cachedNodeText: this.cachedNodeText,
          context: this.context,
          text: nodeOptions.text,
          textAlign: nodeOptions.textAlign,
          textColor: nodeOptions.textColor,
          textFont: nodeOptions.textFont,
          textSize,
          x: node.x + textShiftX,
          y,
          maxWidth: textWidth,
          textStyle: nodeOptions.textStyle,
          textWeight,
          textGap: nodeOptions.textGap,
        });

        if (nodeOptions.textExtraDraw) {
          nodeOptions.textExtraDraw(
            node,
            {
              ...nodeOptions,
              radius,
              alpha,
              color,
              textAlpha,
              textSize,
              textShiftX,
              textShiftY,
              textWeight,
              textWidth,
            },
            state,
          );
        }
      });
    }
  };
}
