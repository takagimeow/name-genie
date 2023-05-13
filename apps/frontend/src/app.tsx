import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

import "./index.css";
import { VSCodeProvider } from "./components/ui/VSCodeProvider/VSCodeProvider";

let router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData() as { message: string };
      return <h1>{data.message}</h1>;
    },
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