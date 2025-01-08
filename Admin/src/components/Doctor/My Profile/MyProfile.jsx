import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

function MyProfile() {
  const [doctor, setDoctor] = useState([]);
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [changeStart, setChangeStart] = useState(null);
  const [changeEnd, setChangeEnd] = useState(null);
  const [changeInfo, setChangeInfo] = useState(false);
  const [phone, setPhone] = useState(null);
  const [fee, setFee] = useState(null);
  const [changeSchedule, setChangeSchedule] = useState(false);

  console.log(schedule);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor/getData-doctor`,
        { headers: { Authorization: `Barer ${Cookies.get("token")}` } }
      );
      setDoctor(response.data.doctor);
      setSchedule(response.data.doctor.weeklySchedule);
      setPhone(response.data.doctor.phone);
      setFee(response.data.doctor.appointmentFee);
    };

    fetchData();
  }, []);

  const handleChangeEndTime = (e) => {
    setChangeSchedule(true);
    setChangeEnd(e.target.value);
    const updatedSchedule = [...schedule];
    updatedSchedule[current].endTime = e.target.value;
    setSchedule(updatedSchedule);
  };
  const handleChangeStartTime = (e) => {
    setChangeSchedule(true);
    setChangeStart(e.target.value);
    const updatedSchedule = [...schedule];
    updatedSchedule[current].startTime = e.target.value;
    setSchedule(updatedSchedule);
  };

  const handleClickEdit = (i) => {
    setActive(!active);
    setCurrent(i);
  };

  const clickSave = async () => {
    if (phone === doctor.phone && fee === doctor.appointmentFee) {
      return setChangeInfo(false);
    }

    const data = { phone, appointmentFee: fee };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor/${doctor._id}`,
        data,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      toast.success("success save");
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (e) {
      const error = e.response.data.error[0].msg;
      toast.error(error);
    }
  };

  const handleChangeSchedule = async () => {
    if (!changeSchedule) {
      return;
    }

    const data = { weeklySchedule: schedule };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor/${doctor._id}`,
        data,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      toast.success("success update");
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (e) {
      const error = e.response.data.error[0].msg;
      toast.error(error);
    }
  };
  // const handleSchedule = () => {};

  return (
    <div className="my-profile">
      <h2 className="text-lg font-medium">My Profile</h2>
      <div className="form flex gap-20 p-5 border rounded-sm bg-white mt-6">
        <div className="right gap-6">
          <div className="image">
            <img width={"200px"} src={doctor?.image} />
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-600">Name:</span>
              <span className="font-semibold text-[#3b82f6]">
                {doctor?.name}
              </span>
            </div>
            <div className="flex items-center mt-4 gap-3">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="font-semibold text-[#3b82f6]">
                {doctor?.email}
              </span>
            </div>
            <div className="flex items-center mt-4 gap-3">
              <span className="font-medium text-gray-600">Phone:</span>
              {!changeInfo ? (
                <span className="font-semibold text-[#3b82f6]">
                  {doctor?.phone}
                </span>
              ) : (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  className="py-1 px-2 rounded-sm border outline-none "
                />
              )}
            </div>
            <div className="flex items-center mt-4 gap-3">
              <span className="font-medium text-gray-600">Fees:</span>
              {!changeInfo ? (
                <span className="font-semibold text-[#3b82f6]">
                  {doctor?.appointmentFee}$
                </span>
              ) : (
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  type="number"
                  className="py-1 px-2 rounded-sm border outline-none "
                />
              )}
            </div>
          </div>
          {!changeInfo ? (
            <button
              onClick={() => setChangeInfo(true)}
              className="py-2 px-6 bg-[#5f6fff] rounded-lg mt-5 text-white"
            >
              change information
            </button>
          ) : (
            <button
              onClick={clickSave}
              className="py-2 px-6 bg-[#5f6fff] rounded-lg mt-5 text-white"
            >
              save
            </button>
          )}
        </div>
        <div className="left flex-1">
          <table className="w-full mt-4 flex flex-col">
            <thead className="bg-white py-3 px-5 flex ">
              <th className="flex-1 text-start">Day</th>
              <th className="flex-1 text-start">Start Time</th>
              <th className="flex-1 text-start">End Time</th>
              <th className="flex-1 text-end">Edit</th>
            </thead>
            <tbody>
              {doctor?.weeklySchedule?.map((s, i) => {
                return (
                  <tr className="bg-gray-50 py-3 px-5 flex border-b" key={i}>
                    <td className="flex-1 text-start">{s.day}</td>
                    <td className="flex-1 text-start">
                      {!active ? (
                        s?.startTime
                      ) : current === i ? (
                        <input
                          onChange={handleChangeStartTime}
                          type="time"
                          value={changeStart ? changeStart : s.startTime}
                        />
                      ) : (
                        s.startTime
                      )}
                    </td>
                    <td className="flex-1 text-start">
                      {!active ? (
                        s?.endTime
                      ) : current === i ? (
                        <input
                          onChange={handleChangeEndTime}
                          type="time"
                          value={changeEnd ? changeEnd : s.endTime}
                        />
                      ) : (
                        s.endTime
                      )}
                    </td>
                    <td
                      onClick={() => handleClickEdit(i)}
                      className="flex-1 flex justify-end"
                    >
                      <FiEdit />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-end">
            <button
              onClick={handleChangeSchedule}
              className={
                !changeSchedule
                  ? "py-2 px-6  bg-gray-200 cursor-auto rounded-lg mt-5 text-white"
                  : "py-2 px-6  bg-[#5f6fff]  rounded-lg mt-5 cursor-pointer text-white"
              }
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
