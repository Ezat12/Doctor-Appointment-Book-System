import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { stor } from "./rtk/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={stor}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
