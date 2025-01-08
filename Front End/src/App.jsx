import { useState } from "react";
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

function App() {
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
        <Route path="/contact" element={<Contact/>} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
