import React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import img_logo from "../../assets/logo-BNCDj_dh.svg";
import { useNavigate } from "react-router";

function Navbar() {
  const navigator = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigator("/");
  };

  return (
    <div className="navbar flex items-center justify-between py-4 px-7 border-b">
      <div className="logo flex items-center gap-4">
        <img src={img_logo} width={"150px"} />
        <div className="text-gray-600 border-gray-700 border mt-3 rounded-2xl p-1 px-3 text-sm">
          Admin
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="py-2 px-10 font-medium rounded-3xl bg-[#5f6fff] text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
