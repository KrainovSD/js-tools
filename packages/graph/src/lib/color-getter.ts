export function colorGetter() {
  const chosenColors: Record<string, string> = {};
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];
  let cursor = 0;

  return function color(key: string) {
    if (chosenColors[key]) return chosenColors[key];

    chosenColors[key] = colors[cursor];
    cursor++;

    if (cursor >= colors.length) cursor = 0;

    return chosenColors[key];
  };
}
