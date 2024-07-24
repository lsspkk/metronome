import React from "react";
import ReactDOM from "react-dom/client";
import Songs from "./Home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ExportUrl from "./ExportUrl.tsx";
import { ImportText } from "./ImportText.tsx";
import ImportUrl from "./ImportUrl.tsx";
import Metronome from "./Metronome.tsx";
import MetronomeSong from "./MetronomeSong.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Songs />,
  },
  {
    path: "/metronome",
    element: <Metronome />,
  },
  {
    path: "/metronome/song/:id",
    element: <MetronomeSong />,
  },
  { path: "/transfer", element: <ImportUrl /> },
  { path: "/import-url", element: <ImportUrl /> },
  { path: "/export-url", element: <ExportUrl /> },
  { path: "/import-text", element: <ImportText /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
