import { colorToRgb, extractRgb, fadeRgb, rgbAnimationByProgress } from "@/lib";
import type { NodeInterface } from "@/types";
import type { GraphCanvas } from "../GraphCanvas";
import {
  animationByProgress,
  drawText,
  isNodeVisible,
  nodeIterationExtractor,
  nodeOptionsGetter,
  nodeRadiusGetter,
} from "../lib";
import type { GraphState, NodeOptionsInterface } from "../types";

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
    let radiusInitial = nodeOptions.radius ?? this.nodeSettings.nodeRadiusInitial;
    let textAlpha = nodeOptions.textAlpha;
    let textSize = nodeOptions.textSize;
    let textShiftX = nodeOptions.textShiftX;
    let textShiftY = nodeOptions.textShiftY;
    let textWeight = nodeOptions.textWeight;
    let textWidth = nodeOptions.textWidth;
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

        if (this.nodeSettings.highlightByNodeNodeSizing) {
          radiusInitial = animationByProgress(
            radiusInitial,
            this.nodeSettings.highlightByNodeNodeSizingAdditional,
            this.highlightProgress,
          );
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

        if (this.nodeSettings.highlightByLinkNodeSizing) {
          radiusInitial = animationByProgress(
            radiusInitial,
            this.nodeSettings.highlightByLinkNodeSizingAdditional,
            this.highlightProgress,
          );
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

    const radius =
      nodeOptions.shape === "circle" || !nodeOptions.shape
        ? nodeRadiusGetter({
            radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
            radiusInitial,
            radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
            radiusFactor: this.nodeSettings.nodeRadiusFactor,
            linkCount: node.linkCount,
          })
        : radiusInitial;

    node._radius = radius;
    node._width = nodeOptions.width;
    node._height = nodeOptions.height;
    node._shape = nodeOptions.shape ?? "circle";

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
            node.x - nodeOptions.width / 2,
            node.y - nodeOptions.height / 2,
            nodeOptions.width,
            nodeOptions.height,
            nodeOptions.borderRadius,
          );
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

    /** text */
    if (nodeOptions.textVisible && nodeOptions.text) {
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
          y: node.y + radius + textShiftY,
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
