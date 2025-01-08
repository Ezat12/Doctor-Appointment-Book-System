import React from "react";
import img_appointment from "../../assets/Appointment.svg";
import img_AddDoctor from "../../assets/Add-Doctor.svg";
import img_DoctorList from "../../assets/Doctor-List.svg";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router";
import Appointments from "../Appointments/Appointments";
import AddDoctor from "../Add Doctor/AddDoctor";
import ListDoctor from "../List Doctor/ListDoctor";

function Home() {
  const [content, setContent] = useState(
    location.pathname.split("/")[2] === "appointment"
      ? "Appointments"
      : location.pathname.split("/")[2] === "add-doctor"
      ? "Add Doctor"
      : "Doctors List"
  );
  const navigator = useNavigate();

  const handleChangeContent = (e) => {
    setContent(e.target.innerHTML.split(">")[1]);
    if (e.target.innerHTML.split(">")[1] === "Appointments") {
      navigator("/admin/appointment");
    } else if (e.target.innerHTML.split(">")[1] === "Add Doctor") {
      navigator("/admin/add-doctor");
    } else {
      navigator("/admin/list-doctor");
    }
  };

  return (
    <div className="home">
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
                content === "Add Doctor"
                  ? "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer bg-[#f2f3ff] border-r-4 border-[#5f6fff]"
                  : "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer "
              }
            >
              <img src={img_AddDoctor} />
              Add Doctor
            </li>
            <li
              onClick={handleChangeContent}
              className={
                content === "Doctors List"
                  ? "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer bg-[#f2f3ff] border-r-4 border-[#5f6fff]"
                  : "px-7 py-5 font-medium flex items-center gap-3  cursor-pointer"
              }
            >
              <img src={img_DoctorList} />
              Doctors List
            </li>
          </ul>
        </div>
        <div className="col-span-4 bg-[#f8f9fd] p-7">
          {content === "Appointments" ? (
            <Appointments />
          ) : content === "Add Doctor" ? (
            <AddDoctor />
          ) : (
            <ListDoctor />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
