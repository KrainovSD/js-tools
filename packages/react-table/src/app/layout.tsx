import { Flex } from "@krainovsd/react-ui";
import { ConfigProvider } from "antd";
import { Link, Outlet } from "react-router";
import { ROUTES } from "./router";

export function Layout() {
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
      <Flex gap={10} style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Flex style={{ width: 200, padding: 24 }} vertical gap={10}>
          {ROUTES.map((route) => {
            return (
              <Link key={route.path} to={route.path}>
                {route.name}
              </Link>
            );
          })}
        </Flex>
        <Flex
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "24px",
            overflow: "hidden",
            background: "#F0F0F0",
          }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </ConfigProvider>
  );
}
