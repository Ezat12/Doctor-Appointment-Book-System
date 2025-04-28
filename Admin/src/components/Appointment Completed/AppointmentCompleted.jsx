import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { FaCheckDouble } from "react-icons/fa6";
import { PiChecksBold } from "react-icons/pi";
import { BeatLoader } from "react-spinners";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

function AppointmentsCompleted() {
  const [appointment, setAppointment] = useState([]);
  const [changeAction, setChangeAction] = useState(false);
  const [current, setCurrent] = useState(null);
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

  const handleCancelPaidAppointment = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/appointment/cancel-paidAppointment/${id}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );

      toast.promise(Promise.resolve(response), {
        pending: "Processing...",
        success: "Payment status cancelled successfully",
        error: "Error cancelling payment status",
      });

      location.reload();
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#e5e7eb6b] z-10 flex items-center justify-center">
          <BeatLoader size={"18px"} color="#245cff" />
        </div>
      )}
      <h2 className="text-lg font-medium">Completed Appointments</h2>
      <table className="w-full mt-4 flex flex-col">
        <thead className="bg-white py-3 px-5 flex">
          <th className="flex-1 text-start">#</th>
          <th className="flex-1 text-start">Patient</th>
          <th className="flex-1 text-start">Date & Time</th>
          <th className="flex-1 text-start">Doctor</th>
          <th className="flex-1 text-start">Fees</th>
          <th className="flex-1 text-start">Status</th>
          <th className="flex-1 text-end">Payment</th>
        </thead>
        <tbody>
          {loadingAppointment ? (
            <tr className="bg-gray-100 py-3 px-5 flex border-b">
              <td colSpan="8" className="flex-1 text-center py-4">
                <BeatLoader size={"10px"} color="#245cff" />
              </td>
            </tr>
          ) : appointment.filter((app) => app.status === "Completed").length >
            0 ? (
            appointment.map(
              (app, index) =>
                app.status === "Completed" && (
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
                      <span className="text-green-500">{app.status}</span>
                    </td>
                    <td className="flex-1 flex items-center justify-end">
                      {app.is_paid ? (
                        <div className="flex items-center">
                          <div className="group">
                            <button className="border rounded-md py-2 px-10 transform duration-200 text-gray-600 flex gap-4 items-center justify-center hover:text-white hover:border-green-500 hover:bg-green-500">
                              Paid
                              <PiChecksBold
                                size={"25px"}
                                className="text-green-500 group-hover:text-white"
                              />
                            </button>
                          </div>
                          {changeAction && current === index && (
                            <span
                              onClick={() =>
                                handleCancelPaidAppointment(app._id)
                              }
                              className="flex ml-2 items-center justify-center border border-gray-400 rounded-md p-1 cursor-pointer transform duration-100 hover:bg-red-600 hover:border-red-500 hover:text-white"
                            >
                              <IoMdClose size={"20px"} />
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-red-500">
                            Not Paid
                          </span>
                        </div>
                      )}
                    </td>
                    
                  </tr>
                )
            )
          ) : (
            <tr className="bg-gray-100 py-3 px-5 flex border-b">
              <td colSpan="8" className="flex-1 text-center py-4">
                No Completed Appointments Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentsCompleted;
