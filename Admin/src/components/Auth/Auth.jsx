import React, { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router";

function Auth() {
  const [login, setLogin] = useState("Admin");
  const [email, setEmail] = useState("ez@gmail.com");
  const [password, setPassword] = useState("123456");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    if (Cookies.get("token")) {
      navigator("/admin/appointment");
    }
  }, []);

  const loginAdmin = async () => {
    const data = { email, password };
    if (email.length > 0 && password.length > 0) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_SERVER}/login`,
          data
        );
        const role = response.data.user.role;
        if (role === "admin") {
          Cookies.set("token", response.data.token);
          navigator("/admin/appointment");
        } else {
          toast.error("the email or password is not correct");
        }
        setLoading(false);
      } catch (e) {
        const error = e.response.data.message;
        toast.error(error);
        setLoading(false);
      }
    }
  };

  const loginDoctor = async () => {
    const data = { email, password };
    if (email.length > 0 && password.length > 0) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_SERVER}/login-doctor`,
          data
        );
        Cookies.set("token", response.data.token);
        navigator("/doctor");
        setLoading(false);
      } catch (e) {
        console.log(e);
        const error = e.response.data.message;
        toast.error(error);
        setLoading(false);
      }
    }
  };

  const clickLogin = () => {
    setAccept(true);
    if (login === "Admin") {
      loginAdmin();
    } else {
      console.log("Yes");
      loginDoctor();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-4">
          <span className="text-[#5f6fff]">{login}</span> Login
        </h2>
        <div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="admin@example.com"
              className={
                accept && email.length <= 0
                  ? "w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:border-gray-300 focus:ring-blue-500"
                  : "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              }
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="********"
              className={
                accept && password.length <= 0
                  ? "w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:border-gray-300 focus:ring-blue-500"
                  : "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              }
            />
          </div>
          {!loading ? (
            <button
              onClick={clickLogin}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          ) : (
            <div className="text-center w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SyncLoader color="#fff" />
            </div>
          )}
        </div>
        {login === "Admin" ? (
          <p className="text-center text-sm text-gray-500 mt-4">
            Doctor Login?
            <a
              onClick={() => setLogin("Doctor")}
              href="#"
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Click here
            </a>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500 mt-4">
            Admin Login?
            <a
              onClick={() => setLogin("Admin")}
              href="#"
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Click here
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
