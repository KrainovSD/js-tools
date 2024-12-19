export type PositionPlacements =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "right-center"
  | "right-top"
  | "right-bottom"
  | "top-left"
  | "top-center"
  | "top-right"
  | "left-center"
  | "left-top"
  | "left-bottom"
  | "flex";

export type VisiblePosition = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  placement: PositionPlacements;
};

type InitialPosition = {
  targetNode?: HTMLElement;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
type GetVisiblePositionOptions = {
  node: HTMLElement;
  visibleArea?: HTMLElement;
  initialPosition?: InitialPosition;
  placement?: Exclude<PositionPlacements, "flex">;
  stepX?: number;
  stepY?: number;
  flex?: boolean;
};
export function getVisiblePosition({
  initialPosition,
  node,
  visibleArea,
  placement = "bottom-center",
  stepX = placement === "bottom-center" ||
  placement === "bottom-left" ||
  placement === "bottom-right" ||
  placement === "top-left" ||
  placement === "top-center" ||
  placement === "top-right"
    ? 0
    : 10,
  stepY = placement === "left-bottom" ||
  placement === "left-center" ||
  placement === "left-top" ||
  placement === "right-bottom" ||
  placement === "right-top" ||
  placement === "right-center"
    ? 0
    : 10,
  flex,
}: GetVisiblePositionOptions): VisiblePosition {
  const windowWidth = document.documentElement.clientWidth;
  const windowHeight = document.documentElement.clientHeight;
  let xStart = 0;
  let xEnd = windowWidth;
  let yStart = 0;
  let yEnd = windowHeight;

  if (visibleArea) {
    const { top, left, height, width } = visibleArea.getBoundingClientRect();
    xStart = left;
    xEnd = left + width;
    yStart = top;
    yEnd = top + height;
  }

  let targetHeight = 0;
  let targetWidth = 0;

  let {
    top: targetTopPosition,
    left: targetLeftPosition,
    height: nodeHeight,
    width: nodeWidth,
  } = node.getBoundingClientRect();

  if (initialPosition && initialPosition.targetNode) {
    const {
      top: childTop,
      left: childLeft,
      height,
      width,
    } = initialPosition.targetNode.getBoundingClientRect();
    targetHeight = height;
    targetWidth = width;
    targetTopPosition = childTop;
    targetLeftPosition = childLeft;
  }
  if (initialPosition && initialPosition.position) {
    if (initialPosition.position.x) {
      targetLeftPosition = initialPosition.position.x;
    }
    if (initialPosition.position.y) {
      targetTopPosition = initialPosition.position.y;
    }
    if (initialPosition.position.height) {
      targetHeight = initialPosition.position.height;
    }
    if (initialPosition.position.width) {
      targetWidth = initialPosition.position.width;
    }
  }

  function isCompletelyVisibleX(left: number) {
    const endXPosition = nodeWidth + left;

    return xStart <= left && xEnd >= endXPosition;
  }
  function isCompletelyVisibleY(top: number) {
    const endYPosition = nodeHeight + top;

    return yStart <= top && yEnd >= endYPosition;
  }

  let correctLeft: number | null = targetLeftPosition;
  let correctTop: number | null = targetTopPosition;

  const { x, y } = getStartPositions({
    targetHeight,
    targetWidth,
    targetLeftPosition,
    nodeHeight,
    nodeWidth,
    stepX,
    stepY,
    targetTopPosition,
  });
  switch (placement) {
    case "bottom-center": {
      correctLeft = x.bottomCenter;
      correctTop = y.bottom;
      let placement: PositionPlacements = "bottom-center";
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomLeft)) {
          placement = "bottom-left";
          correctLeft = x.bottomLeft;
        } else if (isCompletelyVisibleX(x.bottomRight)) {
          placement = "bottom-right";
          correctLeft = x.bottomRight;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = y.top;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "bottom-left": {
      correctLeft = x.bottomLeft;
      correctTop = y.bottom;
      let placement: PositionPlacements = "bottom-left";

      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomCenter)) {
          placement = "bottom-center";
          correctLeft = x.bottomCenter;
        } else if (isCompletelyVisibleX(x.bottomRight)) {
          placement = "bottom-right";
          correctLeft = x.bottomRight;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = y.top;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "bottom-right": {
      correctLeft = x.bottomRight;
      correctTop = y.bottom;
      let placement: PositionPlacements = "bottom-right";

      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomCenter)) {
          placement = "bottom-center";
          correctLeft = x.bottomCenter;
        } else if (isCompletelyVisibleX(x.bottomLeft)) {
          placement = "bottom-left";
          correctLeft = x.bottomLeft;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = y.top;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "right-bottom": {
      correctLeft = x.right;
      correctTop = y.rightBottom;
      let placement: PositionPlacements = "right-bottom";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightCenter)) {
          placement = "right-center";
          correctTop = y.rightCenter;
        } else if (isCompletelyVisibleY(y.rightTop)) {
          placement = "right-top";
          correctTop = y.rightTop;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = x.left;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "right-center": {
      correctLeft = x.right;
      correctTop = y.rightCenter;
      let placement: PositionPlacements = "right-center";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightTop)) {
          placement = "right-top";
          correctTop = y.rightTop;
        } else if (isCompletelyVisibleY(y.rightBottom)) {
          placement = "right-bottom";
          correctTop = y.rightBottom;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = x.left;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "right-top": {
      correctLeft = x.right;
      correctTop = y.rightTop;
      let placement: PositionPlacements = "right-top";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightCenter)) {
          placement = "right-center";
          correctTop = y.rightCenter;
        } else if (isCompletelyVisibleY(y.rightBottom)) {
          placement = "right-bottom";
          correctTop = y.rightBottom;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = x.left;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "top-center": {
      correctLeft = x.bottomCenter;
      correctTop = y.top;
      let placement: PositionPlacements = "top-center";

      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomLeft)) {
          placement = "top-left";
          correctLeft = x.bottomLeft;
        } else if (isCompletelyVisibleX(x.bottomRight)) {
          placement = "top-right";
          correctLeft = x.bottomRight;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = y.bottom;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "top-left": {
      correctLeft = x.bottomLeft;
      correctTop = y.top;
      let placement: PositionPlacements = "top-left";

      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomCenter)) {
          placement = "top-center";
          correctLeft = x.bottomCenter;
        } else if (isCompletelyVisibleX(x.bottomRight)) {
          placement = "top-right";
          correctLeft = x.bottomRight;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = y.bottom;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "top-right": {
      correctLeft = x.bottomRight;
      correctTop = y.top;
      let placement: PositionPlacements = "top-right";

      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.bottomCenter)) {
          placement = "top-center";
          correctLeft = x.bottomCenter;
        } else if (isCompletelyVisibleX(x.bottomLeft)) {
          placement = "top-left";
          correctLeft = x.bottomLeft;
        }
      }
      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = y.bottom;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "left-bottom": {
      correctLeft = x.left;
      correctTop = y.rightBottom;
      let placement: PositionPlacements = "left-bottom";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightCenter)) {
          placement = "left-center";
          correctTop = y.rightCenter;
        } else if (isCompletelyVisibleY(y.rightTop)) {
          placement = "left-top";
          correctTop = y.rightTop;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;
          correctLeft = x.right;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "left-center": {
      correctLeft = x.left;
      correctTop = y.rightCenter;
      let placement: PositionPlacements = "left-center";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightTop)) {
          placement = "left-top";
          correctTop = y.rightTop;
        } else if (isCompletelyVisibleY(y.rightBottom)) {
          placement = "left-bottom";
          correctTop = y.rightBottom;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;
          correctLeft = x.right;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    case "left-top": {
      correctLeft = x.left;
      correctTop = y.rightTop;
      let placement: PositionPlacements = "left-top";

      if (!isCompletelyVisibleY(correctTop)) {
        if (isCompletelyVisibleY(y.rightCenter)) {
          placement = "left-center";
          correctTop = y.rightCenter;
        } else if (isCompletelyVisibleY(y.rightBottom)) {
          placement = "left-bottom";
          correctTop = y.rightBottom;
        }
      }
      if (!isCompletelyVisibleX(correctLeft)) {
        if (isCompletelyVisibleX(x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;

          correctLeft = x.right;
        }
      }

      if (flex && (!isCompletelyVisibleX(correctLeft) || !isCompletelyVisibleY(correctTop))) {
        return getFlexVisiblePosition({
          initialLeft: correctLeft,
          initialTop: correctTop,
          isCompletelyVisibleX,
          isCompletelyVisibleY,
          nodeHeight,
          nodeWidth,
          xEnd,
          yEnd,
        });
      }

      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
    default: {
      return {
        top: correctTop,
        left: correctLeft,
        right: xEnd - correctLeft - nodeWidth,
        bottom: yEnd - correctTop - nodeHeight,
        placement,
      };
    }
  }
}

type GetStartPositions = {
  targetWidth: number;
  targetHeight: number;
  nodeWidth: number;
  nodeHeight: number;
  targetLeftPosition: number;
  targetTopPosition: number;
  stepY: number;
  stepX: number;
};
type XPositions = "bottomCenter" | "bottomLeft" | "bottomRight" | "right" | "left";
type YPosition = "rightCenter" | "rightTop" | "rightBottom" | "bottom" | "top";

function getStartPositions({
  targetHeight,
  targetWidth,
  nodeHeight,
  nodeWidth,
  targetLeftPosition,
  targetTopPosition,
  stepX,
  stepY,
}: GetStartPositions) {
  const childBottomCenter = targetWidth ? targetLeftPosition + targetWidth / 2 : targetLeftPosition;
  const childBottom = targetHeight ? targetTopPosition + targetHeight : targetTopPosition;
  const childRightCenter = targetHeight ? targetTopPosition + targetHeight / 2 : targetTopPosition;

  const x: Record<XPositions, number> = {
    bottomCenter: childBottomCenter - nodeWidth / 2 + stepX,
    bottomRight: targetLeftPosition + targetWidth + stepX - nodeWidth,
    bottomLeft: targetLeftPosition + stepX,
    left: targetLeftPosition - nodeWidth - stepX,
    right: targetLeftPosition + targetWidth + stepX,
  };

  const y: Record<YPosition, number> = {
    bottom: childBottom + stepY,
    top: targetTopPosition - stepY - nodeHeight,
    rightCenter: childRightCenter - nodeHeight / 2 + stepY,
    rightBottom: targetTopPosition + targetHeight - nodeHeight + stepY,
    rightTop: targetTopPosition + stepY,
  };

  return { x, y };
}

type GetFlexVisiblePosition = {
  isCompletelyVisibleY: (top: number) => boolean;
  isCompletelyVisibleX: (left: number) => boolean;
  initialLeft: number;
  initialTop: number;
  xEnd: number;
  yEnd: number;
  nodeWidth: number;
  nodeHeight: number;
};

function getFlexVisiblePosition({
  initialLeft,
  initialTop,
  isCompletelyVisibleX,
  isCompletelyVisibleY,
  nodeHeight,
  nodeWidth,
  xEnd,
  yEnd,
}: GetFlexVisiblePosition): VisiblePosition {
  if (!isCompletelyVisibleY(initialTop)) {
    initialTop = yEnd - nodeHeight;
  }
  if (!isCompletelyVisibleX(initialLeft)) {
    initialLeft = xEnd - nodeWidth;
  }

  return {
    top: initialTop,
    left: initialLeft,
    bottom: yEnd - initialTop - nodeHeight,
    right: xEnd - initialLeft - nodeWidth,
    placement: "flex",
  };
}
