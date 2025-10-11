export const getUniqueId = (() => {
  const prefix = "icon";
  let id = 1_000_000;

  return () => {
    id += 1;

    return `${prefix}-${id.toString(16)}`;
  };
})();
