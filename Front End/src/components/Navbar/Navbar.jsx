import React, { useEffect, useState } from "react";
import img_logo from "../../assets/logo-BNCDj_dh.svg";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";

function Navbar() {
  const [active, setActive] = useState(false);
  const [pathName, usePathName] = useState(location.pathname);
  const [dropDown, setDropDown] = useState(false);

  const navigator = useNavigate();

  const handleClickLogin = () => {
    Cookies.remove("auth-token");
    location.href = "/";
    location.reload;
  };

  const handleClickOutSide = (e) => {
    if (!e.target.closest(".drop-down")) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutSide);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  return (
    <div className="navbar container mx-auto py-5 border-b-2">
      <div className="flex items-center justify-between lg:px-0 md:px-0 px-2">
        <div className="Logo cursor-pointer">
          <img src={img_logo} className="h-8 lg:h-10 md:h-10" />
        </div>
        <ul className="items-center gap-5 font-semibold hidden md:flex lg:flex">
          <Link
            to={"/"}
            className={`cursor-pointer transform duration-75 ${
              location.pathname === "/" ? "border-b-2 border-[#5f6fff]" : ""
            }`}
          >
            HOME
          </Link>
          <Link
            to={"/doctors"}
            className={`cursor-pointer transform duration-75 ${
              location.pathname === "/doctors"
                ? "border-b-2 border-[#5f6fff]"
                : ""
            }`}
          >
            ALL DOCTORS
          </Link>
          <Link
            to={"/about"}
            className={`cursor-pointer transform duration-75 ${
              location.pathname === "/about"
                ? "border-b-2 border-[#5f6fff]"
                : ""
            }`}
          >
            ABOUT
          </Link>
          <Link
            to={"/contact"}
            className={`cursor-pointer transform duration-75 ${
              location.pathname === "/contact"
                ? "border-b-2 border-[#5f6fff]"
                : ""
            }`}
          >
            CONTACT
          </Link>
        </ul>
        <div className="btn flex gap-3 items-center relative">
          <div className="More drop-down lg:hidden md:hidden ">
            <div onClick={() => setDropDown(true)} className="cursor-pointer">
              <AiOutlineMenu size={"27px"} />
            </div>
            {dropDown && (
              <ul className="text-sm items-center gap-5 z-50 font-semibold flex flex-col absolute w-44 bg-gray-50 p-4 rounded-lg shadow-xl top-14 right-20">
                <Link
                  to={"/"}
                  onClick={() => setDropDown(false)}
                  className={`cursor-pointer transform duration-75 ${
                    location.pathname === "/"
                      ? "border-b-2 border-[#5f6fff]"
                      : ""
                  }`}
                >
                  HOME
                </Link>
                <Link
                  to={"/doctors"}
                  onClick={() => setDropDown(false)}
                  className={`cursor-pointer transform duration-75 ${
                    location.pathname === "/doctors"
                      ? "border-b-2 border-[#5f6fff]"
                      : ""
                  }`}
                >
                  ALL DOCTORS
                </Link>
                <Link
                  to={"/about"}
                  onClick={() => setDropDown(false)}
                  className={`cursor-pointer transform duration-75 ${
                    location.pathname === "/about"
                      ? "border-b-2 border-[#5f6fff]"
                      : ""
                  }`}
                >
                  ABOUT
                </Link>
                <Link
                  to={"/contact"}
                  onClick={() => setDropDown(false)}
                  className={`cursor-pointer transform duration-75 ${
                    location.pathname === "/contact"
                      ? "border-b-2 border-[#5f6fff]"
                      : ""
                  }`}
                >
                  CONTACT
                </Link>
              </ul>
            )}
          </div>
          {!Cookies.get("auth-token") ? (
            <Link
              to={"/auth"}
              className="text-white bg-[#5f6fff] border-2 border-[#5f6fff] rounded-2xl p-3 text-sm lg:text-lg mg:text-lg px-3 lg:px-6 md:px-6 transform duration-100 hover:text-[#5f6fff] hover:bg-white"
            >
              Create account
            </Link>
          ) : (
            <div className="relative">
              <div
                onClick={() => setActive(!active)}
                className="text-2xl flex items-center gap-1 cursor-pointer"
              >
                <CgProfile />
                <IoIosArrowDown />
              </div>
              {active && (
                <div className="absolute z-50 top-9 right-0 p-4 flex flex-col gap-4 min-w-44 bg-gray-100 text-sm font-medium ">
                  <span
                    onClick={() => {
                      navigator("/profile");
                      setActive(false);
                    }}
                    className="cursor-pointer"
                  >
                    My Profile
                  </span>
                  <span
                    onClick={() => {
                      navigator("/my-appointment");
                      setActive(false);
                    }}
                    className="cursor-pointer"
                  >
                    My Appointment
                  </span>
                  <span
                    onClick={handleClickLogin}
                    className="text-red-500 cursor-pointer"
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
