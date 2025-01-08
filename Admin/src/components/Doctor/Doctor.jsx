import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import img_appointment from "../../assets/Appointment.svg";
import img_Profile from "../../assets/image-myprofile.png";
import { CgProfile } from "react-icons/cg";
import AppointmentDoctor from "./Appointment Doctor/AppointmentDoctor";
import MyProfile from "./My Profile/MyProfile";

function Doctor() {
  const [content, setContent] = useState(
    location.pathname.split("/")[2] === "appointment"
      ? "Appointments"
      : "My Profile"
  );
  const navigator = useNavigate();

  const handleChangeContent = (e) => {
    setContent(e.target.innerHTML.split(">")[1]);
    if (e.target.innerHTML.split(">")[1] === "Appointments") {
      navigator("/doctor/appointment");
    } else {
      navigator("/doctor/my-profile");
    }
  };

  return (
    <div className="doctor">
      <Navbar />
      <div className="grid grid-cols-5 min-h-screen">
        <div className="col-span-1 border-r">
          <ul className="flex flex-col mt-4">
            <li
              onClick={handleChangeContent}
              className={
                content === "Appointments"
                  ? "px-7 py-5 font-medium flex items-center gap-3 bg-[#f2f3ff] border-r-4 border-[#5f6fff] cursor-pointer"
                  : "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer "
              }
            >
              <img src={img_appointment} />
              Appointments
            </li>
            <li
              onClick={handleChangeContent}
              className={
                content === "My Profile"
                  ? "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer bg-[#f2f3ff] border-r-4 border-[#5f6fff]"
                  : "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer "
              }
            >
              <img src={img_Profile} className="rounded-full w-9 -ml-2 mr-1" />
              My Profile
            </li>
          </ul>
        </div>
        <div className="col-span-4 bg-[#f8f9fd] p-7">
          {content === "Appointments" ? <AppointmentDoctor /> : <MyProfile />}
        </div>
      </div>
    </div>
  );
}

export default Doctor;
