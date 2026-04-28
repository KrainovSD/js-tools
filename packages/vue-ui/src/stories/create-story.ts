import { type Component, h } from "vue";

export function createStory<T>(component: Component): T {
  return {
    render: (args: unknown) => ({
      components: { component },
      setup() {
        return { args };
      },
      render() {
        return h(
          "div",
          {
            style: {
              display: "flex",
              width: "calc(100vw - 50px)",
              height: "calc(100vh - 50px)",
              overflow: "hidden",
              padding: "10px",
            },
          },
          [h(component, args as T)],
        );
      },
    }),
    args: {
      columns: [],
      rows: [],
    },
  } as unknown as T;
}
