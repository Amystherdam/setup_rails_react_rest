import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("App");
  const root = createRoot(container);

  root.render(<App />);
});

export default App;
