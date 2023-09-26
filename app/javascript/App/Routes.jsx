import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./Components/Pages/Home/Index";
import UserSignin from "./Components/Pages/Login/UserSignin";

import Auth from "./Services/Auth";

function RequireAuth({ children }) {
  return Auth.isAuthenticated() ? children : <Navigate to="/login" />;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<UserSignin />} />

      <Route
        path="home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default Router;
