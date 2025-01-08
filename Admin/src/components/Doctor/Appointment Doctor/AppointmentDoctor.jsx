import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FiEdit } from "react-icons/fi";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FaCheckDouble } from "react-icons/fa6";

function AppointmentDoctor() {
  const [appointment, setAppointment] = useState([]);
  const [accept, setAccept] = useState(false);
  const [edit, setEdit] = useState(false);
  const [current, setCurrent] = useState(null);
  const [action, setAction] = useState(null);
  const [change, setChange] = useState(null);
  const navigator = useNavigate();

  console.log(appointment);

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
        setChange(e.data.data.status);
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
        setChange(e.data.status);
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

  // const

  const editAction = async () => {
    // setEdit()
    if (action === "Scheduled" || !action) {
      setEdit(false);
    } else if (action === "Completed") {
      actionCompleted();
    } else {
      actionCancel();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/get-appointmentDoctor`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setAppointment(response.data.data);
        setAccept(true);
      } catch (e) {
        console.log(e);

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
  }, [change]);

  return (
    <div className="appointment-doctor">
      <h1 className="text-lg font-medium">All Appointment</h1>
      <table className="w-full mt-4 flex flex-col">
        <thead className="bg-white py-3 px-5 flex ">
          <th className="flex-1 text-start">#</th>
          <th className="flex-1 text-start">Patient</th>
          <th className="flex-1 text-start">Date & Time</th>
          <th className="flex-1 text-start">Fees</th>
          <th className="flex-1 text-start">Action</th>
          <th className="flex-1 text-end">Edit</th>
        </thead>
        <tbody>
          {appointment.length > 0 ? (
            appointment.map((app, index) => {
              return (
                <tr key={index} className="bg-gray-100 py-3 px-5 flex border-b">
                  <td className="flex-1 text-start">{index + 1}</td>
                  <td className="flex-1 text-start">{app.user.name}</td>
                  <td className="flex-1 text-start">
                    {app.date} & {app.time}
                  </td>
                  <td className="flex-1 text-start">
                    {app.doctor.appointmentFee}$
                  </td>
                  <td className="flex-1 text-start">
                    {edit && current === index ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={editAction}
                          className="py-1 px-4  bg-[#4BB543] rounded-md text-white"
                        >
                          Ok
                        </button>
                        <button
                          onClick={() => setEdit(false)}
                          className="py-2 px-4 bg-[#bb2124] rounded-md text-white"
                        >
                          <FaCircleXmark />
                        </button>
                        <select
                          onChange={(e) => setAction(e.target.value)}
                          value={action}
                          className="px-4 py-1"
                        >
                          <option>Scheduled</option>
                          <option>Completed</option>
                          <option>Cancel</option>
                        </select>
                      </div>
                    ) : app.status !== "Completed" ? (
                      app.status
                    ) : (
                      <span className="text-[#4BB543] font-medium">
                        {app.status}
                      </span>
                    )}
                  </td>
                  {app.status !== "Completed" ? (
                    <td
                      onClick={() => {
                        setEdit(true);
                        setCurrent(index);
                      }}
                      className="flex-1 text-end flex justify-end cursor-pointer"
                    >
                      <FiEdit size={"20px"} />
                    </td>
                  ) : (
                    <td className="flex-1 text-end flex justify-end">
                      <FaCheckDouble size={"20px"} />
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <div className="text-2xl font-semibold mt-5 ml-3" >Not Found</div>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentDoctor;
