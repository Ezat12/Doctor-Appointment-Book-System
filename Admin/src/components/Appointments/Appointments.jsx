import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FaCheckDouble } from "react-icons/fa6";

function Appointments() {
  const [appointment, setAppointment] = useState([]);
  const [changeAction, setChangeAction] = useState(false);
  const [current, setCurrent] = useState(null);
  const [action, setAction] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/getAll-appointment`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setAppointment(response.data.data);
      } catch (e) {
        const error = e.response.data.message;
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: `${error}!`,
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.remove("token");
            navigator("/");
          }
        });
      }
    };
    fetchData();
  }, []);

  const actionCompleted = async () => {
    const response = axios
      .put(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/appointment/complete-appointment/${appointment[current]._id}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      )
      .then((e) => {
        console.log(e);
        // setChange(e.data.data.status);
        location.reload();
      });

    toast.promise(response, {
      pending: "Waiting...",
      success: {
        render() {
          return "success completed";
        },
      },
      error: "something error",
    });
  };

  const actionCancel = async () => {
    const response = axios
      .delete(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/appointment/cancel-appointment/${appointment[current]._id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      )
      .then((e) => {
        console.log(e);
        location.reload();
        // setChange(e.data.status);
      });

    toast.promise(response, {
      pending: "Waiting...",
      success: {
        render() {
          return "success cancel";
        },
      },
      error: "something error",
    });
  };

  const clickChangeAction = () => {
    if (action === "Scheduled" || !action) {
      setChangeAction(false);
    } else if (action === "Completed") {
      actionCompleted();
    } else {
      actionCancel();
    }
  };

  return (
    <div className="appointment">
      <h2 className="text-lg font-medium">All Appointment</h2>
      <table className="w-full mt-4 flex flex-col">
        <thead className="bg-white py-3 px-5 flex ">
          <th className="flex-1 text-start">#</th>
          <th className="flex-1 text-start">Patient</th>
          <th className="flex-1 text-start">Date & Time</th>
          <th className="flex-1 text-start">Doctor</th>
          <th className="flex-1 text-start">Fees</th>
          <th className="flex-1 text-start">Action</th>
          <th className="flex-1 text-end">Edit</th>
        </thead>
        <tbody>
          {appointment.map((app, index) => {
            return (
              <tr key={index} className="bg-gray-100 py-3 px-5 flex border-b">
                <td className="flex-1 text-start">{index + 1}</td>
                <td className="flex-1 text-start">{app.user.name}</td>
                <td className="flex-1 text-start">
                  {app.date} & {app.time}
                </td>
                <td className="flex-1 text-start">{app.doctor.name}</td>
                <td className="flex-1 text-start">
                  {app.doctor.appointmentFee}$
                </td>
                <td className="flex-1 text-start">
                  {!changeAction || index !== current ? (
                    app.status === "Completed" ? (
                      <span className="text-[#4BB543]">{app.status}</span>
                    ) : (
                      app.status
                    )
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={clickChangeAction}
                        className="py-1 px-2 text-sm  bg-[#4BB543] rounded-md text-white"
                      >
                        Ok
                      </button>
                      <FaCircleXmark
                        onClick={() => setChangeAction(false)}
                        size={"18px"}
                        className="cursor-pointer"
                      />
                      <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                      >
                        <option>Scheduled</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  )}
                </td>
                <td className="flex-1 flex justify-end">
                  {app.status !== "Completed" ? (
                    <FiEdit
                      onClick={() => {
                        setChangeAction(true);
                        setCurrent(index);
                      }}
                      className="cursor-pointer"
                    />
                  ) : (
                    <FaCheckDouble />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
