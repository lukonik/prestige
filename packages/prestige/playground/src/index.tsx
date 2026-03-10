import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
const router = getRouter();

createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
