import React from "react";
import { Navigate } from "react-router-dom";

import Auth from "../../../Services/Auth";
import PasswordForm from "./LoginPasswordForm";

function UserSignin() {
  if (Auth.isAuthenticated()) return <Navigate to="/home" replace />;

  return <PasswordForm />;
}

export default UserSignin;
