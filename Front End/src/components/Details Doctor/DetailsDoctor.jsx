import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import mark_img from "../../assets/mark.svg";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { ClockLoader } from "react-spinners";
import { format, addMinutes } from "date-fns";
import Swal from "sweetalert2";

function DetailsDoctor() {
  const { state } = useLocation();
  const [currentDay, setCurrentDay] = useState(0);
  const [chooseTime, setChooseTime] = useState(-1);
  const [timeAppointment, setTimeAppointment] = useState();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState([]);

  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/getAll-timeToken/${state._id}`,
          { date: state.weeklySchedule[currentDay].day },
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        const responseAppointmentUser = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/appointment/get-appointmentUser`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` },
          }
        );

        setAppointment(responseAppointmentUser.data.data);

        setTimeAppointment([...response.data.data]);
        setLoading(false);
      } catch (e) {
        const error = e.response.data.message;
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
    if (Cookies.get("auth-token")) {
      fetchData();
    }
  }, [currentDay]);

  const handleClickDay = (i) => {
    setCurrentDay(i);
    setChooseTime(null);
  };

  const handleChooseTime = (i) => {
    if (i === chooseTime) {
      setChooseTime(null);
    } else {
      setChooseTime(i);
    }
  };

  const handleClickButton = async () => {
    if (!Cookies.get("auth-token")) {
      toast("Login to book appointment");
      return navigator("/auth");
    }
    if (chooseTime === -1 || !chooseTime) {
      return toast.warn("Choose Time");
    }

    const checkAppointment = appointment.findIndex(
      (app) =>
        app.date === state.weeklySchedule[currentDay].day &&
        app.doctor._id === state._id &&
        app.status !== "Completed"
    );


    if (checkAppointment !== -1) {
      return toast.warn("You have an appointment on this day");
    }

    const response = axios
      .post(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/appointment/create-appointment/${state._id}`,
        {
          date: state.weeklySchedule[currentDay].day,
          time: slotsFinal[chooseTime],
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      )
      .catch((e) => {
        // console.log(e);
      });

    toast.promise(response, {
      pending: "waiting...",
      success: {
        render() {
          // setCurrentDay(0);
          navigator("/my-appointment");
          return "success appointment";
        },
      },
      error: "something error",
    });
  };

  const getTimeSlots = (startTime, endTime, interval) => {
    const slots = [];
    let start = convertToMinutes(startTime);
    const end = convertToMinutes(endTime);

    while (start < end) {
      const hour = Math.floor(start / 60)
        .toString()
        .padStart(2, "0");
      const minute = (start % 60).toString().padStart(2, "0");
      slots.push(`${hour}:${minute}`);
      start += interval;
    }

    return slots;
  };

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const slots = getTimeSlots(
    state?.weeklySchedule[currentDay]?.startTime,
    state?.weeklySchedule[currentDay]?.endTime,
    30
  );

  const slotsFinal = slots.filter((time) => !timeAppointment?.includes(time));

  return (
    <div className="container mx-auto mt-6 lg:px-0 md:px-0 px-3">
      <div className="content-doctor flex lg:flex-row md:flex-row flex-col gap-4">
        <div className="image bg-[#5f6fff] rounded-xl">
          <img src={state.image} width={"300px"} />
        </div>
        <div className="flex flex-col rounded-xl border-2 p-5 flex-1">
          <div className="flex items-center gap-3 text-3xl font-semibold">
            <p>Dr: {state.name}</p>
            <img src={mark_img} />
          </div>
          <div className="flex items-center gap-1 mt-4">
            <span className="text-sm font-medium">About</span>
            <IoIosInformationCircleOutline size={"17px"} />
          </div>
          <p className="text-sm mt-3 font-medium text-gray-600">
            {state.description}
          </p>
          <div className="mt-5 font-semibold text-lg">
            <span className="text-gray-500">Appointment fee:</span> $
            {state.appointmentFee}
          </div>
        </div>
      </div>
      <div className="reservation mt-6">
        <div className="flex flex-wrap justify-start items-center lg:justify-center md:justify-center gap-5">
          {state.weeklySchedule.map((d, i) => {
            return (
              <div
                onClick={() => handleClickDay(i)}
                className={
                  currentDay !== i
                    ? "rounded-2xl py-3 px-5 border-2 cursor-pointer"
                    : "rounded-2xl py-3 px-5 border-2 cursor-pointer border-[#5f6ff] text-white bg-[#5f6fff]"
                }
                key={i}
                id={i}
              >
                {d.day}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6 border-2 rounded-xl mt-5 p-6">
          {!loading ? (
            slotsFinal.map((time, index) => {
              return (
                <span
                  onClick={() => handleChooseTime(index)}
                  key={index}
                  className={
                    index === chooseTime
                      ? "px-2 py-3 rounded-lg border-2 text-center cursor-pointer text-white bg-[#5f6fff] border-[#5f6fff]"
                      : "px-2 py-3 rounded-lg border-2 text-center  cursor-pointer"
                  }
                >
                  {time}
                </span>
              );
            })
          ) : (
            <div className="flex items-center justify-center">
              <ClockLoader />
            </div>
          )}
        </div>
        <button
          onClick={handleClickButton}
          className="mt-5 px-12 py-3 text-white bg-[#5f6fff] rounded-2xl mb-12"
        >
          Book an appointment
        </button>
      </div>
    </div>
  );
}

export default DetailsDoctor;
