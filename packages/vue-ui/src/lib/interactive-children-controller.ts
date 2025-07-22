export type InteractiveChildrenControllerOptions = {
  selector?: string;
  autofocus?: boolean;
};

export function createInteractiveChildrenController(
  element: HTMLElement,
  {
    autofocus = false,
    selector = `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
  }: InteractiveChildrenControllerOptions = {},
) {
  const interactiveElements = Array.from(element.querySelectorAll<HTMLElement>(selector));
  if (autofocus) {
    focusFirst();
  }

  function focusFirst() {
    interactiveElements[0]?.focus?.();
  }
  function focusLast() {
    interactiveElements[interactiveElements.length - 1]?.focus?.();
  }
  function focusNext() {
    const focusedIndex = interactiveElements.findIndex(
      (element) => document.activeElement === element,
    );
    if (focusedIndex === -1) {
      focusFirst();
    } else if (focusedIndex < interactiveElements.length - 1) {
      interactiveElements[focusedIndex + 1]?.focus?.();
    } else {
      focusFirst();
    }
  }
  function focusPrev() {
    const focusedIndex = interactiveElements.findIndex(
      (element) => document.activeElement === element,
    );
    if (focusedIndex === -1) {
      focusFirst();
    } else if (focusedIndex > 0) {
      interactiveElements[focusedIndex - 1]?.focus?.();
    } else {
      focusLast();
    }
  }

  return { focusNext, focusPrev, interactiveElements };
}
