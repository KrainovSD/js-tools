import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router";
import { Layout } from "./layout";
import { Common } from "./routes/common";
import { CommonFlexColumn } from "./routes/common-flex-column";
import { CommonFormatters } from "./routes/common-formatters";
import { CommonInnerTable } from "./routes/common-inner-table";
import { CommonVirtual } from "./routes/common-virtual";
import { CommonVirtualRow } from "./routes/common-virtual-row";
import { Gantt } from "./routes/gantt";
import { GanttVirtual } from "./routes/gantt-vitrual";
import { GanttVirtualRow } from "./routes/gantt-vitrual-row";

type Route = {
  path: string;
  name: string;
  element: () => React.JSX.Element;
};

export const ROUTES: Route[] = [
  { name: "Common", path: "common", element: Common },
  { name: "Flex Column", path: "flex", element: CommonFlexColumn },
  { name: "Virtual Row", path: "virtual-row", element: CommonVirtualRow },
  { name: "Virtual", path: "virtual", element: CommonVirtual },
  { name: "Common Inner Table", path: "common-inner-table", element: CommonInnerTable },
  { name: "Formatters", path: "common-formatters", element: CommonFormatters },
  { name: "Gantt", path: "gantt", element: Gantt },
  { name: "Gantt Virtual Row", path: "gantt-virtual-row", element: GanttVirtualRow },
  { name: "Gantt Virtual", path: "gantt-virtual", element: GanttVirtual },
];

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        {ROUTES.map((route) => {
          return <Route key={route.path} path={route.path} element={<route.element />} />;
        })}
        <Route path="/*" element={<Common />} />
      </Route>
    </>,
  ),
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
