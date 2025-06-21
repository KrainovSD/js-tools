export function execAnimation(element: HTMLElement | null | undefined, className: string) {
  const eventController = new AbortController();

  return new Promise((resolve) => {
    if (!element) {
      resolve(true);

      return;
    }

    element.addEventListener(
      "animationend",
      () => {
        resolve(true);
        element?.classList?.remove?.(className);
        eventController.abort();
      },
      {
        signal: eventController.signal,
      },
    );
    element.classList.add(className);
  });
}
