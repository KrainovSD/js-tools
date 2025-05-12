import type { HighlightSettingsInterface } from "../types/highlight-settings";

export const HIGHLIGHT_SETTINGS: Required<HighlightSettingsInterface> = {
  highlightByHoverNode: true,
  highlightByHoverLink: true,
  linkHoverExtraZone: 2,
  /** Node */
  highlightByNodeOnlyRoot: true,
  highlightByNodeForNodeColorFading: false,
  highlightByNodeForNodeColor: null,
  highlightByNodeForNodeSizingAdditional: 0.5,
  highlightByNodeForNodeSizingAdditionalCoefficient: 0.35,
  highlightByNodeForNodeColorFadingMin: 0.15,
  highlightByNodeForNodeFadingMin: 0.21,
  highlightByNodeForNodeBorderColor: null,
  highlightByNodeForNodeBorderSizingAdditional: 0,

  highlightByLinkForNodeColorFading: false,
  highlightByLinkForNodeColor: null,
  highlightByLinkForNodeSizingAdditional: 0.5,
  highlightByLinkForNodeSizingAdditionalCoefficient: 0.35,
  highlightByLinkForNodeColorFadingMin: 0.15,
  highlightByLinkForNodeFadingMin: 0.21,
  highlightByLinkForNodeBorderColor: null,
  highlightByLinkForNodeBorderSizingAdditional: 0,
  /** Text */
  highlightByNodeForTextShiftXAdditional: 0,
  highlightByNodeForTextShiftYAdditional: 2,
  highlightByNodeForTextSizingAdditional: 1,
  highlightByNodeForTextWeightAdditional: 0,
  highlightByNodeForTextFadingMin: 0.21,

  highlightByLinkForTextShiftXAdditional: 0,
  highlightByLinkForTextShiftYAdditional: 2,
  highlightByLinkForTextSizingAdditional: 1,
  highlightByLinkForTextWeightAdditional: 0,
  highlightByLinkForTextFadingMin: 0.21,
  /** Label */
  highlightByNodeForLabelFadingMin: 0.21,
  highlightByNodeForLabelSizingAdditional: 1,
  highlightByNodeForLabelWeightAdditional: 0,

  highlightByLinkForLabelFadingMin: 0.21,
  highlightByLinkForLabelSizingAdditional: 1,
  highlightByLinkForLabelWeightAdditional: 0,
  /** Link */
  highlightByNodeForLinkFadingMin: 0.21,
  highlightByNodeForLinkSizeAdditional: 0,
  highlightByNodeForLinkColor: null,

  highlightByLinkForLinkFadingMin: 0.21,
  highlightByLinkForLinkSizeAdditional: 0,
  highlightByLinkForLinkColor: null,
  /** Arrow */
  highlightByNodeForArrowFadingMin: 0.21,
  highlightByNodeForArrowSizeAdditional: 0,
  highlightByNodeForArrowColor: null,
  highlightByNodeForArrowBorderColor: null,
  highlightByNodeForArrowBorderSizingAdditional: 0,

  highlightByLinkForArrowFadingMin: 0.21,
  highlightByLinkForArrowSizeAdditional: 0,
  highlightByLinkForArrowColor: null,
  highlightByLinkForArrowBorderColor: null,
  highlightByLinkForArrowBorderSizingAdditional: 0,
};
