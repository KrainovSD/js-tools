type XPositions = "insideCenter" | "insideLeft" | "insideRight" | "right" | "left";
type YPosition = "insideCenter" | "insideTop" | "insideBottom" | "bottom" | "top";

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

type InitialVisiblePosition = {
  top: number;
  left: number;
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
  initialPosition?: InitialPosition;
  visibleArea?: HTMLElement;
  placement?: Exclude<PositionPlacements, "flex">;
  stepX?: number;
  stepY?: number;
  flex?: boolean;
  nested?: boolean;
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
  nested,
}: GetVisiblePositionOptions): VisiblePosition {
  /** Viewport Variables */
  const totalHeight = document.body.scrollHeight;
  const totalWidth = document.body.scrollWidth;
  const viewport = visibleArea ?? document.body;
  const scrollTop = document.body.scrollTop;
  const scrollLeft = document.body.scrollLeft;
  const rect = viewport.getBoundingClientRect();
  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;
  const xStart = visibleArea ? viewport.offsetLeft - viewport.scrollLeft : Math.abs(rect.left);
  const xEnd = xStart + viewportWidth;
  const yStart = visibleArea ? viewport.offsetTop : Math.abs(rect.top);
  const yEnd = yStart + viewportHeight;

  /** Target Variables */
  let targetHeight = 0;
  let targetWidth = 0;
  let targetTopPosition = 0;
  let targetLeftPosition = 0;

  /** Not bounding because not need scale  */
  const nodeHeight = node.clientHeight;
  const nodeWidth = node.clientWidth;

  if (initialPosition?.targetNode) {
    const { top, left, height, width } = initialPosition.targetNode.getBoundingClientRect();
    targetHeight = height;
    targetWidth = width;
    targetTopPosition = top + scrollTop;
    targetLeftPosition = left + scrollLeft;
  }
  if (initialPosition?.position) {
    if (initialPosition.position.x != undefined) {
      targetLeftPosition = initialPosition.position.x + scrollLeft;
    }
    if (initialPosition.position.y != undefined) {
      targetTopPosition = initialPosition.position.y + scrollTop;
    }
    if (initialPosition.position.height != undefined) {
      targetHeight = initialPosition.position.height;
    }
    if (initialPosition.position.width != undefined) {
      targetWidth = initialPosition.position.width;
    }
  }

  /** Inherit Position */
  let inheritLeft = 0;
  let inheritTop = 0;
  let inheritHeight = 0;
  let inheritWidth = 0;
  if (nested) {
    const {
      left = 0,
      top = 0,
      height = 0,
      width = 0,
    } = node.parentElement?.getBoundingClientRect?.() ?? {};
    inheritLeft = left + scrollLeft;
    inheritTop = top + scrollTop;
    inheritHeight = height;
    inheritWidth = width;
  }

  /** Initial Position */
  const targetXCenter =
    targetWidth != undefined ? targetLeftPosition + targetWidth / 2 : targetLeftPosition;
  const targetYCenter =
    targetHeight != undefined ? targetTopPosition + targetHeight / 2 : targetTopPosition;
  const targetYEnd =
    targetHeight != undefined ? targetTopPosition + targetHeight : targetTopPosition;

  const x: Record<XPositions, number> = {
    insideCenter: targetXCenter - nodeWidth / 2 + stepX,
    insideRight: targetLeftPosition + targetWidth + stepX - nodeWidth,
    insideLeft: targetLeftPosition + stepX,
    left: targetLeftPosition - nodeWidth - stepX,
    right: targetLeftPosition + targetWidth + stepX,
  };

  const y: Record<YPosition, number> = {
    bottom: targetYEnd + stepY,
    top: targetTopPosition - stepY - nodeHeight,
    insideCenter: targetYCenter - nodeHeight / 2 + stepY,
    insideBottom: targetTopPosition + targetHeight - nodeHeight + stepY,
    insideTop: targetTopPosition + stepY,
  };
  /** Find visible position */
  function isCompletelyVisibleX(left: number) {
    const endXPosition = nodeWidth + left;

    return xStart <= left && xEnd >= endXPosition;
  }
  function isCompletelyVisibleY(top: number) {
    const endYPosition = nodeHeight + top;

    return yStart <= top && yEnd >= endYPosition;
  }

  let visiblePositions = processVisiblePositions({
    targetLeftPosition,
    targetTopPosition,
    x,
    y,
    placement,
    flex,
    nodeHeight,
    nodeWidth,
    xEnd,
    xStart,
    yEnd,
    yStart,
    isCompletelyVisibleX,
    isCompletelyVisibleY,
  });
  if (
    flex &&
    (!isCompletelyVisibleX(visiblePositions.left) || !isCompletelyVisibleY(visiblePositions.top))
  ) {
    visiblePositions = getFlexVisiblePosition({
      initialLeft: visiblePositions.left,
      initialTop: visiblePositions.top,
      isCompletelyVisibleX,
      isCompletelyVisibleY,
      nodeHeight,
      nodeWidth,
      xEnd,
      yEnd,
    });
  }

  visiblePositions.left -= inheritLeft;
  visiblePositions.top -= inheritTop;

  return {
    placement: visiblePositions.placement,
    left: visiblePositions.left,
    top: visiblePositions.top,
    bottom: nested
      ? inheritHeight - (visiblePositions.top + nodeHeight)
      : totalHeight - (visiblePositions.top + nodeHeight),
    right: nested
      ? inheritWidth - (visiblePositions.left + nodeWidth)
      : totalWidth - (visiblePositions.left + nodeWidth),
  };
}

type ProcessVisiblePositions = {
  placement: Exclude<PositionPlacements, "flex">;
  x: Record<XPositions, number>;
  y: Record<YPosition, number>;
  targetLeftPosition: number;
  targetTopPosition: number;
  nodeWidth: number;
  nodeHeight: number;
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  flex: boolean | undefined;
  isCompletelyVisibleX: (position: number) => boolean;
  isCompletelyVisibleY: (position: number) => boolean;
};
function processVisiblePositions(opts: ProcessVisiblePositions): InitialVisiblePosition {
  let correctLeft: number | null = opts.targetLeftPosition;
  let correctTop: number | null = opts.targetTopPosition;

  switch (opts.placement) {
    case "bottom-center": {
      correctLeft = opts.x.insideCenter;
      correctTop = opts.y.bottom;
      let placement: PositionPlacements = "bottom-center";
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideLeft)) {
          placement = "bottom-left";
          correctLeft = opts.x.insideLeft;
        } else if (opts.isCompletelyVisibleX(opts.x.insideRight)) {
          placement = "bottom-right";
          correctLeft = opts.x.insideRight;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = opts.y.top;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "bottom-left": {
      correctLeft = opts.x.insideLeft;
      correctTop = opts.y.bottom;
      let placement: PositionPlacements = "bottom-left";

      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideCenter)) {
          placement = "bottom-center";
          correctLeft = opts.x.insideCenter;
        } else if (opts.isCompletelyVisibleX(opts.x.insideRight)) {
          placement = "bottom-right";
          correctLeft = opts.x.insideRight;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = opts.y.top;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "bottom-right": {
      correctLeft = opts.x.insideRight;
      correctTop = opts.y.bottom;
      let placement: PositionPlacements = "bottom-right";

      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideCenter)) {
          placement = "bottom-center";
          correctLeft = opts.x.insideCenter;
        } else if (opts.isCompletelyVisibleX(opts.x.insideLeft)) {
          placement = "bottom-left";
          correctLeft = opts.x.insideLeft;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.top)) {
          placement = placement.replace("bottom", "top") as PositionPlacements;
          correctTop = opts.y.top;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "right-bottom": {
      correctLeft = opts.x.right;
      correctTop = opts.y.insideBottom;
      let placement: PositionPlacements = "right-bottom";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideCenter)) {
          placement = "right-center";
          correctTop = opts.y.insideCenter;
        } else if (opts.isCompletelyVisibleY(opts.y.insideTop)) {
          placement = "right-top";
          correctTop = opts.y.insideTop;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = opts.x.left;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "right-center": {
      correctLeft = opts.x.right;
      correctTop = opts.y.insideCenter;
      let placement: PositionPlacements = "right-center";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideTop)) {
          placement = "right-top";
          correctTop = opts.y.insideTop;
        } else if (opts.isCompletelyVisibleY(opts.y.insideBottom)) {
          placement = "right-bottom";
          correctTop = opts.y.insideBottom;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = opts.x.left;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "right-top": {
      correctLeft = opts.x.right;
      correctTop = opts.y.insideTop;
      let placement: PositionPlacements = "right-top";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideCenter)) {
          placement = "right-center";
          correctTop = opts.y.insideCenter;
        } else if (opts.isCompletelyVisibleY(opts.y.insideBottom)) {
          placement = "right-bottom";
          correctTop = opts.y.insideBottom;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.left)) {
          placement = placement.replace("right", "left") as PositionPlacements;
          correctLeft = opts.x.left;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "top-center": {
      correctLeft = opts.x.insideCenter;
      correctTop = opts.y.top;
      let placement: PositionPlacements = "top-center";

      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideLeft)) {
          placement = "top-left";
          correctLeft = opts.x.insideLeft;
        } else if (opts.isCompletelyVisibleX(opts.x.insideRight)) {
          placement = "top-right";
          correctLeft = opts.x.insideRight;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = opts.y.bottom;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "top-left": {
      correctLeft = opts.x.insideLeft;
      correctTop = opts.y.top;
      let placement: PositionPlacements = "top-left";

      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideCenter)) {
          placement = "top-center";
          correctLeft = opts.x.insideCenter;
        } else if (opts.isCompletelyVisibleX(opts.x.insideRight)) {
          placement = "top-right";
          correctLeft = opts.x.insideRight;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = opts.y.bottom;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "top-right": {
      correctLeft = opts.x.insideRight;
      correctTop = opts.y.top;
      let placement: PositionPlacements = "top-right";

      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.insideCenter)) {
          placement = "top-center";
          correctLeft = opts.x.insideCenter;
        } else if (opts.isCompletelyVisibleX(opts.x.insideLeft)) {
          placement = "top-left";
          correctLeft = opts.x.insideLeft;
        }
      }
      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.bottom)) {
          placement = placement.replace("top", "bottom") as PositionPlacements;
          correctTop = opts.y.bottom;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "left-bottom": {
      correctLeft = opts.x.left;
      correctTop = opts.y.insideBottom;
      let placement: PositionPlacements = "left-bottom";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideCenter)) {
          placement = "left-center";
          correctTop = opts.y.insideCenter;
        } else if (opts.isCompletelyVisibleY(opts.y.insideTop)) {
          placement = "left-top";
          correctTop = opts.y.insideTop;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;
          correctLeft = opts.x.right;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "left-center": {
      correctLeft = opts.x.left;
      correctTop = opts.y.insideCenter;
      let placement: PositionPlacements = "left-center";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideTop)) {
          placement = "left-top";
          correctTop = opts.y.insideTop;
        } else if (opts.isCompletelyVisibleY(opts.y.insideBottom)) {
          placement = "left-bottom";
          correctTop = opts.y.insideBottom;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;
          correctLeft = opts.x.right;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    case "left-top": {
      correctLeft = opts.x.left;
      correctTop = opts.y.insideTop;
      let placement: PositionPlacements = "left-top";

      if (!opts.isCompletelyVisibleY(correctTop)) {
        if (opts.isCompletelyVisibleY(opts.y.insideCenter)) {
          placement = "left-center";
          correctTop = opts.y.insideCenter;
        } else if (opts.isCompletelyVisibleY(opts.y.insideBottom)) {
          placement = "left-bottom";
          correctTop = opts.y.insideBottom;
        }
      }
      if (!opts.isCompletelyVisibleX(correctLeft)) {
        if (opts.isCompletelyVisibleX(opts.x.right)) {
          placement = placement.replace("left", "right") as PositionPlacements;

          correctLeft = opts.x.right;
        }
      }

      return {
        top: correctTop,
        left: correctLeft,
        placement,
      };
    }
    default: {
      return {
        top: correctTop,
        left: correctLeft,
        placement: opts.placement,
      };
    }
  }
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
}: GetFlexVisiblePosition): InitialVisiblePosition {
  if (!isCompletelyVisibleY(initialTop)) {
    initialTop = yEnd - nodeHeight;
  }
  if (!isCompletelyVisibleX(initialLeft)) {
    initialLeft = xEnd - nodeWidth;
  }

  return {
    top: initialTop,
    left: initialLeft,
    placement: "flex",
  };
}
