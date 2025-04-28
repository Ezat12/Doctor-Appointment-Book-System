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
import { PiChecksBold } from "react-icons/pi"; /// Paid
import { FaCheck } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";

function Appointments() {
  const [appointment, setAppointment] = useState([]);
  const [changeAction, setChangeAction] = useState(false);
  const [current, setCurrent] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const navigator = useNavigate();

  let countAppointment = 0;

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
        console.error(e);
        Swal.fire({
          title: "Error!",
          text: e.response?.data?.message || "An error occurred",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.remove("token");
            navigator("/");
          }
        });
      } finally {
        setLoadingAppointment(false);
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
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.message);
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

  const handlePaidAppointment = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/appointment/paid-appointment/${id}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      console.log(response.data);
      location.reload();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong Login Again!",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(false);
          Cookies.remove("token");
          navigator("/");
        }
      });
    }
  };

  return (
    <div className="appointment">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#e5e7eb6b] z-10 flex items-center justify-center">
          <BeatLoader size={"18px"} color="#245cff" />
        </div>
      )}
      <h2 className="text-lg font-medium">All Appointment</h2>
      <table className="w-full mt-4 flex flex-col">
        <thead className="bg-white py-3 px-5 flex">
          <th className="flex-1 text-start">#</th>
          <th className="flex-1 text-start">Patient</th>
          <th className="flex-1 text-start">Date & Time</th>
          <th className="flex-1 text-start">Doctor</th>
          <th className="flex-1 text-start">Fees</th>
          <th className="flex-1 text-start">Action</th>
          <th className="flex-1 text-end">Is Paid</th>
          <th className="flex-1 text-end">Edit</th>
        </thead>
        <tbody>
          {loadingAppointment ? (
            <tr className="bg-gray-100 py-3 px-5 flex border-b">
              <td colSpan="8" className="flex-1 text-center py-4">
                <BeatLoader size={"10px"} color="#245cff" />
              </td>
            </tr>
          ) : appointment.length > 0 ? (
            appointment.map(
              (app, index) =>
                app.status === "Scheduled" && (
                  <tr
                    key={index}
                    className="bg-gray-100 py-3 px-5 flex border-b"
                  >
                    <td className="flex-1 text-start">{++countAppointment}</td>
                    <td className="flex-1 text-start">
                      {app.user?.name || "N/A"}
                    </td>
                    <td className="flex-1 text-start">
                      {app.date} & {app.time}
                    </td>
                    <td className="flex-1 text-start">
                      {app.doctor?.name || "N/A"}
                    </td>
                    <td className="flex-1 text-start">
                      {app.doctor?.appointmentFee
                        ? `${app.doctor.appointmentFee}$`
                        : "N/A"}
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
                            className="py-1 px-2 text-sm bg-[#4BB543] rounded-md text-white"
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
                            className="border rounded px-2 py-1"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                    </td>
                    <td className="flex-1 flex items-center justify-end">
                      {app.is_paid ? (
                        <div className="group">
                          <button className="border rounded-md py-2 px-10 transform duration-200 text-gray-600 flex gap-4 items-center justify-center hover:text-white hover:border-green-500 hover:bg-green-500">
                            Paid
                            <PiChecksBold
                              size={"25px"}
                              className="text-green-500 group-hover:text-white"
                            />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-red-500">
                            Not Paid
                          </span>
                          <span
                            onClick={() => handlePaidAppointment(app._id)}
                            className="flex ml-2 text-[#45454552] items-center justify-center border border-gray-400 rounded-md p-1 cursor-pointer transform duration-100 hover:bg-green-600 hover:border-green-500 hover:text-white"
                          >
                            <FaCheck size={"20px"} />
                          </span>
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
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          size={"20px"}
                        />
                      ) : (
                        <FaCheckDouble className="text-green-500" />
                      )}
                    </td>
                  </tr>
                )
            )
          ) : (
            <tr className="bg-gray-100 py-3 px-5 flex border-b">
              <td colSpan="8" className="flex-1 text-center py-4">
                Not Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
