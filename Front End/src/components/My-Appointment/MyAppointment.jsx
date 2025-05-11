import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RiseLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { PiChecksBold } from "react-icons/pi";
import { format, parseISO } from "date-fns";
import { socket } from "../../../utils/socket";

function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [change, setChange] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/get-appointmentUser`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        setAppointments(response.data.data);
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    socket.on("notification", (notification) => {
      console.log(notification);
      setChange(notification);
    });

    fetchAppointments();
  }, [refetch, change]);

  const handleFetchError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    console.error(errorMessage);

    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("auth-token");
        Cookies.remove("patient");
        navigate("/auth");
      }
    });
  };

  const handleCancelAppointment = async (id) => {
    try {
      await toast.promise(
        axios.delete(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/cancel-appointment/${id}`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        ),
        {
          pending: "Cancelling appointment...",
          success: "Appointment cancelled successfully",
          error: "Failed to cancel appointment",
        }
      );

      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Cancellation error:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch {
      return dateString; // Fallback if date format is invalid
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Scheduled: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
      Completed: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 pb-4 border-b border-gray-200">
          My Appointments
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RiseLoader color="#3B82F6" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              You don't have any appointments yet
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={appointment.doctor.image || "/default-doctor.png"}
                      alt={appointment.doctor.name}
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Dr. {appointment.doctor.name}
                      </h2>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fee</p>
                        <p className="font-medium">
                          ${appointment.doctor.appointmentFee}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">
                          {appointment.is_paid ? (
                            <span className="flex items-center text-green-600">
                              Paid <PiChecksBold className="ml-1" />
                            </span>
                          ) : (
                            <span className="text-yellow-600">Pending</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 md:w-48">
                    {appointment.status === "Scheduled" && (
                      <>
                        {!appointment.is_paid && (
                          <button
                            // onClick={() =>
                            //   navigate(`/payment/${appointment._id}`)
                            // }
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Pay Online
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === "Completed" && (
                      <button
                        onClick={() => navigate(`/feedback/${appointment._id}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Leave Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointment;
