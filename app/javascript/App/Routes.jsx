import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Pages/Home/Index";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default Router;
