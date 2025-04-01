import type { Preview } from "@storybook/react";
import { ConfigProvider } from "antd";
import "./global.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <ConfigProvider
          theme={{
            cssVar: true,
            token: {
              fontFamily: "Nunito",
            },
            components: {
              Button: {
                defaultBg: "white",
              },
            },
          }}
        >
          <Story />
        </ConfigProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
