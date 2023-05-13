import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

import "./index.css";
import { HomeIndexPage } from "./components/page/Home/Home";
import { VSCodeProvider } from "./components/ui/VSCodeProvider/VSCodeProvider";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/index.html",
        index: true,
        loader: () => ({ message: "Hello Data Router!" }),
        Component() {
          let data = useLoaderData() as { message: string };
          return <HomeIndexPage />;
        },
      },
    ],
  },
]);

export default function App() {
  return (
    <VSCodeProvider>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </VSCodeProvider>
  );
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export function Root() {
  return <Outlet />;
}
