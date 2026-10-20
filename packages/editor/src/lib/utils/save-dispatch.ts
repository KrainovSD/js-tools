export function saveDispatch(dispatch: () => void) {
  queueMicrotask(() => {
    dispatch();
  });
}
