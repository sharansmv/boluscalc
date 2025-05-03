import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CalculatorProvider } from "@/contexts/CalculatorContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalculatorProvider>
      <App />
    </CalculatorProvider>
  </StrictMode>
);
