import Cookies from "js-cookie";
import img_logo from "../../assets/logo-BNCDj_dh.svg";
import { useNavigate } from "react-router";
import Notification from "../Notification/Notification";

function Navbar() {
  const navigator = useNavigate();

  const pathName = location.pathname.split("/")[1] === "doctor";

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigator("/");
  };

  return (
    <div className="navbar flex items-center justify-between py-4 px-7 border-b">
      <div className="logo flex items-center gap-4">
        <img src={img_logo} width={"150px"} />
        <div className="text-gray-600 border-gray-700 border mt-3 rounded-2xl p-1 px-3 text-sm">
          {pathName ? "Doctor" : "Admin"}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Notification />
        <button
          onClick={handleLogout}
          className="py-2 px-10 font-medium rounded-3xl bg-[#5f6fff] text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
