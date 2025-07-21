export type HighlightText = {
  text: string;
  highlight: boolean;
};
export function createHighlight(text: string, highlights: readonly number[]): HighlightText[] {
  if (highlights.length === 0) return [{ text, highlight: false }];

  const highlightedText: HighlightText[] = [];
  let lastProcessedIndex = 0;

  for (let i = 0; i < highlights.length; i++) {
    const currentIndex = highlights[i];

    if (currentIndex > lastProcessedIndex) {
      highlightedText.push({
        text: text.slice(lastProcessedIndex, currentIndex),
        highlight: false,
      });
    }

    let endIndex = currentIndex;
    while (i + 1 < highlights.length && highlights[i + 1] === endIndex + 1) {
      endIndex++;
      i++;
    }

    highlightedText.push({
      text: text.slice(currentIndex, endIndex + 1),
      highlight: true,
    });

    lastProcessedIndex = endIndex + 1;
  }

  if (lastProcessedIndex < text.length) {
    highlightedText.push({
      text: text.slice(lastProcessedIndex),
      highlight: false,
    });
  }

  return highlightedText;
}
