import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import InitColorSchemeScript from "@mui/joy/InitColorSchemeScript";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InitColorSchemeScript />
    <App />
  </StrictMode>
);
