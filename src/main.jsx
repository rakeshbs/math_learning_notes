import React from "react";
import { createRoot } from "react-dom/client";
import MatrixIntuition from "./MatrixIntuition";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MatrixIntuition />
  </React.StrictMode>
);
