import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import ExcalidrawComponent from "./pages/Excalidraw";
import Welcome from "./pages/Welcome";

// Define the root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Welcome,
});

const excalidrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/excalidraw/$id",
  component: ExcalidrawComponent,
});

// Define route tree
const routeTree = rootRoute.addChildren([indexRoute, excalidrawRoute]);

// Create router instance
const router = createRouter({ routeTree });

// Export the router and routes for use elsewhere
export { rootRoute, router };
