import React from "react";

export function useIsVisible(ref: React.RefObject<HTMLDivElement>) {
  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    observer.observe(ref?.current as Element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
