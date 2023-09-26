import React from "react";

import { Link, useNavigate } from "react-router-dom";

import Logout from "../../../Services/Authentication/Logout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-items-center justify-center items-center h-screen">
      <Link
        onClick={() => Logout().then(() => navigate("/login"))}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Sair
      </Link>
    </div>
  );
}
