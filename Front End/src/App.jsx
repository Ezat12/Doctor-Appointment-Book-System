import { useEffect, useState } from "react";
import Auth from "./pages/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router";
import Hero from "./components/Hero/Hero";
import Doctors from "./components/Doctors/Doctors";
import DetailsDoctor from "./components/Details Doctor/DetailsDoctor";
import Profile from "./components/Profile/Profile";
import MyAppointment from "./components/My-Appointment/myAppointment";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Chat from "./components/Chat/Chat";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { setUser } from "./rtk/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDate = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_SERVER}/user/getDataUser`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      );

      dispatch(setUser(response?.data?.user));
    };

    if (Cookies.get("auth-token")) {
      fetchDate();
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:doctorId" element={<DetailsDoctor />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
