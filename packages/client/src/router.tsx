import path from "node:path";
import { createHashRouter, Navigate, type RouteObject } from "react-router-dom";

import App from "./app";
// import ErrorBoundary from "./error-boundary";

const PATH_PARAM_REGEXP = /\[(.*?)\]/g;

const routes = Object.entries(
  import.meta.glob("./pages/**/index.tsx", { eager: true }),
).map(([key, value]) => {
  const id = path.join(path.relative("./pages", key), "..");
  const routePath = id.replace(PATH_PARAM_REGEXP, ":$1");
  const parts = id.split("/").filter(item => !PATH_PARAM_REGEXP.test(item));
  const rootPage = parts[0];

  return {
    handle: { rootPage, meta: (value as any).default?.routeMeta },
    path: routePath,
    Component: (value as any).default,
    id,
  } as RouteObject;
});

const Router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...routes,
      {
        path: "*",
        element: <Navigate to="/proxies" replace />,
      },
    ],
    // errorElement: <ErrorBoundary />,
  },
]);

export default Router;
