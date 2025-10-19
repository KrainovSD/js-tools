import { isNumber } from "@krainovsd/js-helpers";
import type { GraphCanvas } from "../GraphCanvas";
import { isNodeVisible, nodeFade, nodeHighlight } from "../lib";
import type { NodeInterface } from "../types";
import { drawText } from "./draw-text";

export function getDrawNode<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(nodeRenders: (() => void)[], textRenders: (() => void)[]) {
  return function drawNode(this: GraphCanvas<NodeData, LinkData>, node: NodeInterface<NodeData>) {
    if (!this.context || !node.x || !node.y) return;
    if (node.visible != undefined && !node.visible) {
      node._radius = 0;
      node._width = 0;
      node._height = 0;

      return;
    }

    const nodeOptions = this.nodeOptionsCache[node.id];
    if (!nodeOptions) return;

    if (nodeOptions.nodeDraw && nodeOptions.textDraw) {
      nodeRenders.push(() => {
        if (nodeOptions.nodeDraw) {
          nodeOptions.nodeDraw.bind(this)(node, nodeOptions);
        }
      });

      textRenders.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw.bind(this)(node, nodeOptions);
        }
      });

      return;
    }

    let radius = nodeOptions.radius;
    let width = nodeOptions.width;
    let height = nodeOptions.height;
    let alpha = nodeOptions.alpha;
    let color = nodeOptions.color;
    let borderColor = nodeOptions.borderColor;
    let borderWidth = nodeOptions.borderWidth;
    let textAlpha = nodeOptions.textAlpha;
    let textSize = nodeOptions.textSize;
    let textShiftX = nodeOptions.textShiftX;
    let textShiftY = nodeOptions.textShiftY;
    let textWeight = nodeOptions.textWeight;
    let labelSize = nodeOptions.labelSize;
    let labelWeight = nodeOptions.labelWeight;
    let labelAlpha = nodeOptions.labelAlpha;
    /** Highlight */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** By Node Not Highlight */
      if (!this.highlightedNeighbors.has(node.id) && this.highlightedNode.id != node.id) {
        const fadingOptions = nodeFade({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelFadingMin: this.highlightSettings.highlightByNodeForLabelFadingMin,
          highlightForNodeColorFading: this.highlightSettings.highlightByNodeForNodeColorFading,
          highlightForNodeFadingMin: this.highlightSettings.highlightByNodeForNodeFadingMin,
          highlightForTextFadingMin: this.highlightSettings.highlightByNodeForTextFadingMin,
        });
        alpha = fadingOptions.alpha;
        color = fadingOptions.color;
        textAlpha = fadingOptions.textAlpha;
        labelAlpha = fadingOptions.labelAlpha;
      } else if (
        !this.highlightSettings.highlightByNodeOnlyRoot ||
        (this.highlightSettings.highlightByNodeOnlyRoot && this.highlightedNode.id === node.id)
      ) {
        /** By Node Highlight */
        const highlightOptions = nodeHighlight({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelSizingAdditional:
            this.highlightSettings.highlightByNodeForLabelSizingAdditional,
          highlightForLabelWeightAdditional:
            this.highlightSettings.highlightByNodeForLabelWeightAdditional,
          highlightForNodeBorderColor: this.highlightSettings.highlightByNodeForNodeBorderColor,
          highlightForNodeBorderSizingAdditional:
            this.highlightSettings.highlightByNodeForNodeBorderSizingAdditional,
          highlightForNodeColor: this.highlightSettings.highlightByNodeForNodeColor,
          highlightForNodeSizingAdditional:
            this.highlightSettings.highlightByNodeForNodeSizingAdditional,
          highlightForNodeSizingAdditionalCoefficient:
            this.highlightSettings.highlightByNodeForNodeSizingAdditionalCoefficient,
          highlightForTextShiftXAdditional:
            this.highlightSettings.highlightByNodeForTextShiftXAdditional,
          highlightForTextShiftYAdditional:
            this.highlightSettings.highlightByNodeForTextShiftYAdditional,
          highlightForTextSizingAdditional:
            this.highlightSettings.highlightByNodeForTextSizingAdditional,
          highlightForTextWeightAdditional:
            this.highlightSettings.highlightByNodeForTextWeightAdditional,
        });
        color = highlightOptions.color;
        borderColor = highlightOptions.borderColor;
        borderWidth = highlightOptions.borderWidth;
        radius = highlightOptions.radiusInitial;
        width = highlightOptions.widthInitial;
        height = highlightOptions.heightInitial;
        textSize = highlightOptions.textSize;
        textShiftX = highlightOptions.textShiftX;
        textShiftY = highlightOptions.textShiftY;
        textWeight = highlightOptions.textWeight;
        labelSize = highlightOptions.labelSize;
        labelWeight = highlightOptions.labelWeight;
      }
    }
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** By Link Not Highlight */
      if (
        !this.highlightedNeighbors.has(node.id) &&
        this.highlightedLink.source !== node &&
        this.highlightedLink.target !== node
      ) {
        const fadingOptions = nodeFade({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelFadingMin: this.highlightSettings.highlightByLinkForLabelFadingMin,
          highlightForNodeColorFading: this.highlightSettings.highlightByLinkForNodeColorFading,
          highlightForNodeFadingMin: this.highlightSettings.highlightByLinkForNodeFadingMin,
          highlightForTextFadingMin: this.highlightSettings.highlightByLinkForTextFadingMin,
        });
        alpha = fadingOptions.alpha;
        color = fadingOptions.color;
        textAlpha = fadingOptions.textAlpha;
        labelAlpha = fadingOptions.labelAlpha;
      } else {
        /** By Link Highlight */

        const highlightOptions = nodeHighlight({
          highlightProgress: this.highlightProgress,
          nodeOptions,
          highlightForLabelSizingAdditional:
            this.highlightSettings.highlightByLinkForLabelSizingAdditional,
          highlightForLabelWeightAdditional:
            this.highlightSettings.highlightByLinkForLabelWeightAdditional,
          highlightForNodeBorderColor: this.highlightSettings.highlightByLinkForNodeBorderColor,
          highlightForNodeBorderSizingAdditional:
            this.highlightSettings.highlightByLinkForNodeBorderSizingAdditional,
          highlightForNodeColor: this.highlightSettings.highlightByLinkForNodeColor,
          highlightForNodeSizingAdditional:
            this.highlightSettings.highlightByLinkForNodeSizingAdditional,
          highlightForNodeSizingAdditionalCoefficient:
            this.highlightSettings.highlightByLinkForNodeSizingAdditionalCoefficient,
          highlightForTextShiftXAdditional:
            this.highlightSettings.highlightByLinkForTextShiftXAdditional,
          highlightForTextShiftYAdditional:
            this.highlightSettings.highlightByLinkForTextShiftYAdditional,
          highlightForTextSizingAdditional:
            this.highlightSettings.highlightByLinkForTextSizingAdditional,
          highlightForTextWeightAdditional:
            this.highlightSettings.highlightByLinkForTextWeightAdditional,
        });
        color = highlightOptions.color;
        borderColor = highlightOptions.borderColor;
        borderWidth = highlightOptions.borderWidth;
        radius = highlightOptions.radiusInitial;
        width = highlightOptions.widthInitial;
        height = highlightOptions.heightInitial;
        textSize = highlightOptions.textSize;
        textShiftX = highlightOptions.textShiftX;
        textShiftY = highlightOptions.textShiftY;
        textWeight = highlightOptions.textWeight;
        labelSize = highlightOptions.labelSize;
        labelWeight = highlightOptions.labelWeight;
      }
    }

    /** Node parameters */
    node._radius = radius;
    node._borderWidth = borderWidth;
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
      this.context.lineWidth = borderWidth;
      this.context.strokeStyle = borderColor;
      this.context.fillStyle = color;
      const labelLines = this.cachedNodeLabel[node.id];

      switch (nodeOptions.shape) {
        case "circle": {
          if (!node.image) {
            this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            this.context.fill();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          } else {
            this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            this.context.closePath();
            this.context.save();
            this.context.clip();

            this.context.drawImage(
              node.image,
              node.x - radius,
              node.y - radius,
              radius * 2,
              radius * 2,
            );

            this.context.restore();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          }

          if (node.label && labelLines) {
            this.context.globalAlpha = labelAlpha;
            drawText({
              context: this.context,
              lines: labelLines,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textGap: nodeOptions.labelGap,
              textSize: labelSize,
              textStyle: nodeOptions.labelStyle,
              textWeight: labelWeight,
              x: node.x,
              y: node.y + labelSize / 3,
            });
          }

          break;
        }
        case "square": {
          if (!node.image) {
            this.context.roundRect(
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
              node._borderRadius,
            );
            this.context.fill();
            if (borderWidth > 0) {
              this.context.stroke();
            }
          } else {
            this.context.roundRect(
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
              node._borderRadius,
            );
            this.context.closePath();
            this.context.save();
            this.context.clip();
            this.context.drawImage(
              node.image,
              node.x - width / 2,
              node.y - height / 2,
              width,
              height,
            );
            this.context.restore();

            if (borderWidth > 0) {
              this.context.stroke();
            }
          }
          if (node.label && labelLines) {
            this.context.globalAlpha = labelAlpha;
            drawText({
              context: this.context,
              lines: labelLines,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textGap: nodeOptions.labelGap,
              textSize: labelSize,
              textStyle: nodeOptions.labelStyle,
              textWeight: labelWeight,
              x: node.x,
              y: node.y + labelSize / 3,
            });
          }
          break;
        }
        case "text": {
          if (this.nodeSettings.textNodeDebug) {
            this.context.strokeRect(node.x - width / 2, node.y - height / 2, width, height);
          }

          if (nodeOptions.label && labelLines)
            drawText({
              lines: labelLines,
              context: this.context,
              textAlign: nodeOptions.labelAlign,
              textColor: nodeOptions.labelColor,
              textFont: nodeOptions.labelFont,
              textSize: labelSize,
              x: node.x,
              y: node.y + textSize / 4 - (labelLines.length - 1) * (textSize / 2),
              textStyle: nodeOptions.labelStyle,
              textWeight,
              textGap: nodeOptions.labelGap,
            });
          this.context.fill();
          if (borderWidth > 0) {
            this.context.stroke();
          }
          break;
        }
        default: {
          this.context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          this.context.fill();
          if (borderWidth > 0) {
            this.context.stroke();
          }
          break;
        }
      }
    });

    if (nodeOptions.nodeExtraDraw) {
      nodeRenders.push(() => {
        nodeOptions?.nodeExtraDraw?.bind?.(this)?.(node, {
          ...nodeOptions,
          radius,
          alpha,
          color,
          textAlpha,
          textSize,
          textShiftX,
          textShiftY,
          textWeight,
        });
      });
    }

    /** Text draw */
    const textLines = this.cachedNodeText[node.id];
    if (nodeOptions.textVisible && nodeOptions.text && textLines) {
      textRenders.push(() => {
        if (nodeOptions.textDraw) {
          nodeOptions.textDraw.bind(this)(node, {
            ...nodeOptions,
            radius,
            alpha,
            color,
            textAlpha,
            textSize,
            textShiftX,
            textShiftY,
            textWeight,
          });

          return;
        }

        if (!this.context || !node.x || !node.y || !nodeOptions.text) return;
        this.context.beginPath();
        this.context.globalAlpha = textAlpha;

        let y = node.y + textShiftY;
        if (nodeOptions.shape === "circle") {
          y += radius;
        }
        if (nodeOptions.shape === "square" || nodeOptions.shape === "text") {
          y += height / 2;
        }

        drawText({
          lines: textLines,
          context: this.context,
          textAlign: nodeOptions.textAlign,
          textColor: nodeOptions.textColor,
          textFont: nodeOptions.textFont,
          textSize,
          x: node.x + textShiftX,
          y,
          textStyle: nodeOptions.textStyle,
          textWeight,
          textGap: nodeOptions.textGap,
        });

        if (nodeOptions.textExtraDraw) {
          nodeOptions.textExtraDraw.bind(this)(node, {
            ...nodeOptions,
            radius,
            alpha,
            color,
            textAlpha,
            textSize,
            textShiftX,
            textShiftY,
            textWeight,
          });
        }
      });
    }
  };
}
