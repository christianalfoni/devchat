import React from "react";
import ReactDOM from "react-dom/client";
import { Authentication } from "./components/Authentication.tsx";
import { App } from "./components/App.tsx";
import "./index.css";
import { GlobalServicesProvider } from "./global-services/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalServicesProvider>
      <Authentication>
        <App />
      </Authentication>
    </GlobalServicesProvider>
  </React.StrictMode>
);
