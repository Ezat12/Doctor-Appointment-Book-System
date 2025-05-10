import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import img_appointment from "../../assets/Appointment.svg";
import img_AddDoctor from "../../assets/Add-Doctor.svg";
import img_DoctorList from "../../assets/Doctor-List.svg";
import Navbar from "../Navbar/Navbar";
import Appointments from "../Appointments/Appointments";
import AddDoctor from "../Add Doctor/AddDoctor";
import ListDoctor from "../List Doctor/ListDoctor";
import AppointmentCancelled from "../Appointment Cancelled/AppointmentCancelled";
import AppointmentCompleted from "../Appointment Completed/AppointmentCompleted";
import Chat from "../Chat/Chat";

function Home() {
  const location = useLocation();
  const navigator = useNavigate();

  const getInitialContent = () => {
    const pathSegments = location.pathname.split("/");
    const currentRoute = pathSegments[pathSegments.length - 1];

    const routeMap = {
      appointment: "Appointments",
      "add-doctor": "Add Doctor",
      "appointment-cancelled": "Appointments Cancelled",
      "appointment-completed": "Appointments Completed",
      "doctors-list": "Doctors List",
    };

    return routeMap[currentRoute] || "Appointments";
  };

  const [content, setContent] = useState(getInitialContent());

  const handleChangeContent = (selectedContent) => {
    setContent(selectedContent);

    const routeMap = {
      Appointments: "/admin/appointment",
      "Add Doctor": "/admin/add-doctor",
      "Appointments Cancelled": "/admin/appointment-cancelled",
      "Appointments Completed": "/admin/appointment-completed",
      "Doctors List": "/admin/doctors-list",
    };

    navigator(routeMap[selectedContent]);
  };

  const menuItems = [
    {
      title: "Appointments",
      icon: img_appointment,
      component: <Appointments />,
    },
    {
      title: "Appointments Cancelled",
      icon: img_appointment,
      component: <AppointmentCancelled />,
    },
    {
      title: "Appointments Completed",
      icon: img_appointment,
      component: <AppointmentCompleted />,
    },
    {
      title: "Add Doctor",
      icon: img_AddDoctor,
      component: <AddDoctor />,
    },
    {
      title: "Doctors List",
      icon: img_DoctorList,
      component: <ListDoctor />,
    },
  ];

  return (
    <div className="home">
      <Navbar />
      <div className="grid grid-cols-5 min-h-screen">
        <div className="col-span-1 border-r">
          <ul className="flex flex-col mt-4">
            {menuItems.map((item) => (
              <li
                key={item.title}
                onClick={() => handleChangeContent(item.title)}
                className={
                  content === item.title
                    ? "px-7 py-5 font-medium flex items-center gap-3 bg-[#f2f3ff] border-r-4 border-[#5f6fff] cursor-pointer"
                    : "px-7 py-5 font-medium flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                }
              >
                <img src={item.icon} alt={item.title} className="w-6 h-6" />
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 bg-[#f8f9fd] p-7">
          {menuItems.find((item) => item.title === content)?.component}
        </div>

        <Chat />
      </div>
    </div>
  );
}

export default Home;
