import { useEffect, useState, useRef } from "react";
import img_logo from "../../assets/logo-BNCDj_dh.svg";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { useDispatch } from "react-redux";
import { logout } from "../../rtk/slices/authSlice";
import Notification from "../Notification/Notification";

function Navbar() {
  const [active, setActive] = useState(false);
  const [pathName, setPathName] = useState(window.location.pathname);
  const [dropDown, setDropDown] = useState(false);
  const dropdownRef = useRef(null);
  const menuButtonRef = useRef(null);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleClickLogin = () => {
    Cookies.remove("auth-token");
    Cookies.remove("patient");
    dispatch(logout());
    window.location.href = "/";
  };

  const handleClickOutSide = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(e.target)
    ) {
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
          <img src={img_logo} alt="Logo" className="h-8 lg:h-10 md:h-10" />
        </div>

        <ul className="items-center gap-5 font-semibold hidden md:flex lg:flex">
          <Link
            onClick={() => setPathName("/")}
            to="/"
            className={`cursor-pointer transform duration-75 ${
              pathName === "/" ? "border-b-2 border-[#5f6fff]" : ""
            }`}
          >
            HOME
          </Link>
          <Link
            onClick={() => setPathName("/doctors")}
            to="/doctors"
            className={`cursor-pointer transform duration-75 ${
              pathName === "/doctors" ? "border-b-2 border-[#5f6fff]" : ""
            }`}
          >
            ALL DOCTORS
          </Link>
          <Link
            to="/about"
            onClick={() => setPathName("/about")}
            className={`cursor-pointer transform duration-75 ${
              pathName === "/about" ? "border-b-2 border-[#5f6fff]" : ""
            }`}
          >
            ABOUT
          </Link>
          <Link
            onClick={() => setPathName("/contact")}
            to="/contact"
            className={`cursor-pointer transform duration-75 ${
              pathName === "/contact" ? "border-b-2 border-[#5f6fff]" : ""
            }`}
          >
            CONTACT
          </Link>
        </ul>

        <div className="btn flex gap-3 items-center relative">
          <div className="More lg:hidden md:hidden" ref={menuButtonRef}>
            <button
              onClick={() => setDropDown(!dropDown)}
              className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {dropDown ? (
                <AiOutlineClose size={24} className="text-gray-700" />
              ) : (
                <AiOutlineMenu size={24} className="text-gray-700" />
              )}
            </button>

            {/* Mobile Dropdown Menu */}
            {dropDown && (
              <div
                ref={dropdownRef}
                className="absolute z-50 right-0 top-12 w-56 bg-white rounded-lg shadow-xl p-4 border border-gray-200"
              >
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setDropDown(false)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        pathName === "/"
                          ? "text-[#5f6fff] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/doctors"
                      onClick={() => setDropDown(false)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        pathName === "/doctors"
                          ? "text-[#5f6fff] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      ALL DOCTORS
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      onClick={() => setDropDown(false)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        pathName === "/about"
                          ? "text-[#5f6fff] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      ABOUT
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      onClick={() => setDropDown(false)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        pathName === "/contact"
                          ? "text-[#5f6fff] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      CONTACT
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {!Cookies.get("auth-token") ? (
            <Link
              to="/auth"
              className="text-white bg-[#5f6fff] border-2 border-[#5f6fff] rounded-2xl p-3 text-sm lg:text-lg md:text-lg px-3 lg:px-6 md:px-6 transform duration-100 hover:text-[#5f6fff] hover:bg-white"
            >
              Create account
            </Link>
          ) : (
            <div className="relative flex items-center gap-5">
              <div className="relative">
                <Notification />
              </div>
              <div
                onClick={() => setActive(!active)}
                className="text-2xl flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded-md"
              >
                <CgProfile />
                {active ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </div>
              {active && (
                <div className="absolute z-50 top-12 right-0 p-4 flex flex-col gap-3 min-w-56 bg-white rounded-lg shadow-xl border border-gray-200">
                  <button
                    onClick={() => {
                      navigator("/profile");
                      setActive(false);
                    }}
                    className="text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigator("/my-appointment");
                      setActive(false);
                    }}
                    className="text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  >
                    My Appointment
                  </button>
                  <button
                    onClick={handleClickLogin}
                    className="text-left px-3 py-2 rounded-md hover:bg-red-50 text-red-500"
                  >
                    Logout
                  </button>
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
