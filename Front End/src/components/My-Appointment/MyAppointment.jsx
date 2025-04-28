/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { PropagateLoader, RiseLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { PiChecksBold } from "react-icons/pi";

function MyAppointment() {
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(null);

  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/get-appointmentUser`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        setAppointment(response.data.data);
        setLoading(false);
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
            Cookies.remove("auth-token");
            navigator("/auth");
          }
        });
      }
    };
    fetchData();
  }, [change]);

  const handleClickCancel = async (id, isPaid) => {
    // if (!isPaid) {

    // }
    const response = axios.delete(
      `${
        import.meta.env.VITE_BASE_URL_SERVER
      }/appointment/cancel-appointment/${id}`,
      { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
    );

    toast.promise(response, {
      pending: "Waiting...",
      success: {
        render() {
          setChange(id);
          return "Success Cancel";
        },
      },
      error: "Something Error...",
    });
  };

  return (
    <div className="my-appointment container mx-auto mt-12 lg:px-0 md:px-0 px-3">
      <h1 className="pb-3 border-b-2 text-lg font-semibold text-gray-700">
        My Appointment
      </h1>
      {loading && (
        <div className="mt-6  h-[30vh] flex items-center justify-center">
          <RiseLoader />
        </div>
      )}
      <div className="flex flex-col gap-6 mt-3">
        {appointment.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col gap-3 lg:flex-row md:flex-row justify-between pb-3 border-b"
            >
              <div className="flex gap-4">
                <div className="image bg-[#eaefff]">
                  <img width={"150px"} src={item.doctor.image} />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-lg">Dr: {item.doctor.name}</p>
                  <p className="mt-2 text-gray-600">
                    Day:{" "}
                    <span className="font-medium text-black ml-2">
                      {item.date}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-600">
                    Time:{" "}
                    <span className="font-medium text-black ml-2">
                      {item.time}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-600">
                    Appointment Fee :
                    <span className="font-bold text-black ml-2">
                      {item.doctor.appointmentFee}$
                    </span>
                  </p>
                </div>
              </div>
              {item.status === "Scheduled" ? (
                <div className="flex gap-2 flex-col justify-end">
                  {item.is_paid ? (
                    <div className="group">
                      <button className="border w-full rounded-md py-2 px-10 transform duration-200 text-gray-600 flex gap-4 items-center justify-center hover:text-white hover:border-green-500 hover:bg-green-500">
                        Paid
                        <PiChecksBold
                          size={"25px"}
                          className="text-green-500 group-hover:text-white"
                        />
                      </button>
                    </div>
                  ) : (
                    <button className="border rounded-md py-2 px-10 transform duration-200 text-gray-600 hover:text-white hover:border-[#5f6fff] hover:bg-[#5f6fff] ">
                      Pay Online
                    </button>
                  )}
                  <button
                    onClick={() => handleClickCancel(item._id, item.is_paid)}
                    className="border rounded-md py-2 px-10 text-gray-600 transform duration-200  hover:text-white hover:border-[#ef4444] hover:bg-[#ef4444] "
                  >
                    Cancel appointment
                  </button>
                </div>
              ) : item.status === "Cancelled" ? (
                <div className="flex gap-2 flex-col justify-end">
                  <button className="border rounded-md py-2 px-10 text-white bg-[#ef4444] transform duration-200  border-[#ef4444] cursor-default">
                    Cancelled
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 flex-col justify-end">
                  <button
                    // onClick={() => handleClickCancel(item._id)}
                    className="border rounded-md py-2 px-10 text-gray-600 transform duration-200  hover:text-white hover:border-[#ef4444] hover:bg-[#ef4444]"
                  >
                    Deleted
                  </button>
                  <button className="border cursor-auto rounded-md py-2 px-10 transform duration-200 bg-green-600 text-white">
                    Completed
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyAppointment;
