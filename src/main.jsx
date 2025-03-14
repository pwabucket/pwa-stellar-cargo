import { ErrorBoundary } from "react-error-boundary";
import { HashRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./App.jsx";
import ErrorFallback from "./partials/ErrorFallback.jsx";

/** Register Service Worker */
registerSW({ immediate: true });

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>
);
