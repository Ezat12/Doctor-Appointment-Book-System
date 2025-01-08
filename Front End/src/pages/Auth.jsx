import React, { useState } from "react";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function Auth() {
  const [contain, setContain] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  const signup = async () => {
    setLoading(true);
    const data = { name, email, password, phone };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_SERVER}/signup`,
        data
      );

      Cookies.set("auth-token", response.data.token);
      toast.success("success login");
      navigator("/");
    } catch (e) {
      const error = e.response.data.error[0].msg;
      toast.error(error);
    }
    setLoading(false);
  };
  const login = async () => {
    setLoading(true);
    const data = { email, password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_SERVER}/login`,
        data
      );

      Cookies.set("auth-token", response.data.token);
      toast.success("success login");
      navigator("/");
    } catch (e) {
      const error = e.response.data.message;
      toast.error(error);
    }
    setLoading(false);
  };

  const handleClickButton = () => {
    setAccept(true);

    if (contain === "SignUp") {
      const checkData =
        name.length > 0 &&
        email.length > 0 &&
        phone.length > 0 &&
        password.length > 5;

      if (checkData) {
        /// Fetch Data ========
        signup();
      }
    } else {
      const checkData = email.length > 0 && password.length > 0;
      if (checkData) {
        login();
      }
    }
  };

  return (
    <div className="relative w-full h-[90vh]">
      <div className="w-[450px]  rounded-md shadow-xl p-6 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h1 className="text-3xl font-mono text-center ">{contain} Form</h1>
        <div className="login-signup flex items-center rounded-md border mt-5 relative">
          <button
            onClick={() => setContain("Login")}
            className={
              contain === "Login"
                ? "py-2 px-4 rounded-md text-white flex-1 text-lg font-medium bg-[#5f6fff]"
                : "py-2 px-4 rounded-md text-black  flex-1 text-lg font-medium"
            }
          >
            Login
          </button>
          <button /// background: -webkit-linear-gradient(right,#003366,#004080,#0059b3, #0073e6);
            onClick={() => setContain("SignUp")}
            className={
              contain === "SignUp"
                ? "py-2 px-4 rounded-md text-white flex-1 text-lg font-medium bg-[#5f6fff]"
                : "py-2 px-4 rounded-md text-black  flex-1 text-lg font-medium"
            }
          >
            SignUp
          </button>
        </div>
        <div className="form">
          {contain === "SignUp" && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2 mt-3"
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                className={
                  name.length <= 0 && accept
                    ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-red-500 focus:ring-blue-500"
                    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                placeholder="Enter your name"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2 mt-3"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className={
                email.length <= 0 && accept
                  ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  border-red-500 focus:ring-blue-500"
                  : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-500"
              }
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Field */}
          {contain === "SignUp" && (
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                id="phone"
                className={
                  phone.length <= 0 && accept
                    ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-red-500 focus:ring-blue-500"
                    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className={
                password.length <= 0 && accept
                  ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-red-500 focus:ring-blue-500"
                  : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
              placeholder="Enter your password"
            />
            {accept && password.length <= 5 && (
              <p className="text-white bg-red-400 p-1 px-3 rounded-md mt-2">
                The password must be longer than 4 characters
              </p>
            )}
          </div>
          {/*<div className="flex items-center justify-center mb-4 gap-6">
            <button className="py-2 px-4 rounded-xl border-2 font-medium">
              Doctor
            </button>
            <button className="py-2 px-4 rounded-xl border-2 font-medium">
              User
            </button>
          </div>*/}
          <button
            onClick={handleClickButton}
            className="active w-full text-center btn bg-[#5f6fff] p-3 rounded-md text-2xl font-bold text-white"
          >
            {loading ? <SyncLoader color="#fff" /> : contain}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
