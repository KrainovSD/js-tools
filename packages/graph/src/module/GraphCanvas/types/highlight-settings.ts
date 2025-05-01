export type HighlightSettingsInterface = HighlighCommonSettingsInterface &
  HighlightByNodeForNodeSettingsInterface &
  HighlightByNodeForLabelSettingsInterface &
  HighlightByNodeForTextSettingsInterface &
  HighlightByNodeForLinkSettingsInterface &
  HighlightByNodeForArrowSettingsInterface &
  HighlightByLinkForNodeSettingsInterface &
  HighlightByLinkForTextSettingsInterface &
  HighlightByLinkForLabelSettingsInterface &
  HighlightByLinkForLinkSettingsInterface &
  HighlightByLinkForArrowSettingsInterface;

export type HighlighCommonSettingsInterface = {
  highlightByHoverNode?: boolean;
  highlightByHoverLink?: boolean;
  linkHoverExtraZone?: number;
};

export type HighlightByNodeForNodeSettingsInterface = {
  highlightByNodeForNodeColorFading?: boolean;
  highlightByNodeOnlyRoot?: boolean;
  highlightByNodeForNodeFadingMin?: number;
  highlightByNodeForNodeColorFadingMin?: number;
  highlightByNodeForNodeColor?: string | null;
  highlightByNodeForNodeSizingAdditional?: number;
  highlightByNodeForNodeSizingAdditionalCoefficient?: number;
};
export type HighlightByNodeForLabelSettingsInterface = {
  highlightByNodeForLabelSizingAdditional?: number;
  highlightByNodeForLabelWeightAdditional?: number;
  highlightByNodeForLabelFadingMin?: number;
};
export type HighlightByNodeForTextSettingsInterface = {
  highlightByNodeForTextFadingMin?: number;
  highlightByNodeForTextSizingAdditional?: number;
  highlightByNodeForTextShiftXAdditional?: number;
  highlightByNodeForTextShiftYAdditional?: number;
  highlightByNodeForTextWeightAdditional?: number;
};
export type HighlightByLinkForNodeSettingsInterface = {
  highlightByLinkForNodeColorFading?: boolean;
  highlightByLinkForNodeFadingMin?: number;
  highlightByLinkForNodeColorFadingMin?: number;
  highlightByLinkForNodeColor?: string | null;
  highlightByLinkForNodeSizingAdditional?: number;
  highlightByLinkForNodeSizingAdditionalCoefficient?: number;
};
export type HighlightByLinkForLabelSettingsInterface = {
  highlightByLinkForLabelSizingAdditional?: number;
  highlightByLinkForLabelWeightAdditional?: number;
  highlightByLinkForLabelFadingMin?: number;
};
export type HighlightByLinkForTextSettingsInterface = {
  highlightByLinkForTextFadingMin?: number;
  highlightByLinkForTextSizingAdditional?: number;
  highlightByLinkForTextShiftXAdditional?: number;
  highlightByLinkForTextShiftYAdditional?: number;
  highlightByLinkForTextWeightAdditional?: number;
};

export type HighlightByNodeForLinkSettingsInterface = {
  highlightByNodeForLinkFadingMin?: number;
  highlightByNodeForLinkSizeAdditional?: number;
  highlightByNodeForLinkColor?: string | null;
};
export type HighlightByNodeForArrowSettingsInterface = {
  highlightByNodeForArrowFadingMin?: number;
  highlightByNodeForArrowSizeAdditional?: number;
  highlightByNodeForArrowColor?: string | null;
};

export type HighlightByLinkForLinkSettingsInterface = {
  highlightByLinkForLinkFadingMin?: number;
  highlightByLinkForLinkSizeAdditional?: number;
  highlightByLinkForLinkColor?: string | null;
};
export type HighlightByLinkForArrowSettingsInterface = {
  highlightByLinkForArrowFadingMin?: number;
  highlightByLinkForArrowSizeAdditional?: number;
  highlightByLinkForArrowColor?: string | null;
};
