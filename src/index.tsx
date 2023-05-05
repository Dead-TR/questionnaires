import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import { lazyLoad } from "config";
import "./index.css";

const App = lazyLoad(() => import("containers/App"));

const rootEl: HTMLDivElement | null = document.querySelector("#root");

const createReactApp = () => {
  const root = createRoot(rootEl as HTMLDivElement);

  root.render(
    <Suspense>
      <App />
    </Suspense>,
  );
};

createReactApp();
