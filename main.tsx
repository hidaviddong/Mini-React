import React from "./src/React";
import { createRoot } from "./src/ReactDOM";
import App from "./App";
createRoot(document.getElementById("app") as HTMLElement).render(<App />);
