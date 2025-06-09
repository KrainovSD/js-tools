import React from "react";

export function useDebugProps(props: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log("render");

  for (const [key, value] of Object.entries(props)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      // eslint-disable-next-line no-console
      console.log(key, value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
  }
}
