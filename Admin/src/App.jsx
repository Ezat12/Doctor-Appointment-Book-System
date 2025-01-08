import { useState } from "react";
import { Routes, Route } from "react-router";
import Auth from "./components/Auth/Auth";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Doctor from "./components/Doctor/Doctor";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin/*" element={<Home />}>
          <Route path="appointment" element={<Home />} />
          <Route path="add-doctor" element={<Home />} />
          <Route path="list-doctor" element={<Home />} />
        </Route>
        <Route path="/doctor/*" element={<Doctor />}>
          <Route path="appointment" element={<Doctor />} />
          <Route path="my-profile" element={<Doctor />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
