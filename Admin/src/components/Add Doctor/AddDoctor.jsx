import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { BeatLoader } from "react-spinners";

function AddDoctor() {
  const [image, SetImage] = useState(null);
  const [day, setDay] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [scheduleDay, setScheduleDay] = useState([]);

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [appointmentFee, setAppointmentFee] = useState(null);
  const [address, setAddress] = useState(null);
  const [description, setDescription] = useState(null);
  const [speciality, setSpeciality] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChangeIMage = async (e) => {
    const response = axios
      .post(
        `${import.meta.env.VITE_BASE_URL_SERVER}/upload-image`,
        { image: e.target.files[0] },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((e) => {
        SetImage(e.data.data);
      });
    toast.promise(response, {
      pending: "Waiting to reload image..",
      success: {
        render() {
          return "success add image";
        },
      },
      error: "something error..",
    });
  };

  const handleAddDay = async () => {
    if (!day || !startTime || !endTime) {
      return toast.error("Data not Completed");
    }
    const checkDay = scheduleDay.findIndex((s) => s.day === day);

    if (checkDay > -1) {
      return toast.warn("The Day is Already exists");
    }
    setScheduleDay([...scheduleDay, { day, startTime, endTime }]);
  };

  const handleAddDoctor = async () => {
    const checkData =
      name &&
      email &&
      password &&
      phone &&
      appointmentFee &&
      description &&
      scheduleDay.length > 0 &&
      image &&
      speciality;

    if (!checkData) {
      return toast.error("Data not Completed");
    }

    const data = {
      name,
      email,
      password,
      phone,
      appointmentFee,
      description,
      weeklySchedule: scheduleDay,
      image,
      speciality,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor`,
        data,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      console.log(response);
      setLoading(false);
      toast.success("success add doctor");
    } catch (e) {
      console.log(e);
      setLoading(false);
      const error = e.response.data.error[0].msg;
      toast.error(error);
    }
  };

  return (
    <div className="add-doctor">
      {loading && (
        <div className="fixed w-full h-full top-0 left-0 bg-[#d1d5db5c] flex items-center justify-center">
          <BeatLoader />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Add Doctor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col items-center">
                {!image ? (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <span>Upload</span>
                  </div>
                ) : (
                  <div>
                    <img src={image} width={"200px"} />
                  </div>
                )}
                <label
                  htmlFor="upload"
                  className="mt-2 text-sm text-blue-500 cursor-pointer"
                >
                  Upload doctor picture
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    onChange={handleChangeIMage}
                  />
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Doctor Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Set Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fees"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Fees
              </label>
              <input
                value={appointmentFee}
                onChange={(e) => setAppointmentFee(e.target.value)}
                type="number"
                id="fees"
                placeholder="Doctor fees"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="days"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Speciality
              </label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                id="days"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>General physician</option> {/* طبيب عام */}
                <option>Dermatologist</option> {/* طبيب امراض جلديه */}
                <option>Pediatricians</option> {/* طبيب اطفال */}
                <option>Neurologist</option> {/* طبيب اعصاب */}
                <option>Gastroenterologist</option> {/* طبيب الجهاز الهضمى */}
              </select>
            </div>
            {scheduleDay.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-col">
                  {scheduleDay.map((s, index) => {
                    return (
                      <div
                        key={index}
                        className="border-b py-2 px-3 flex items-center gap-10"
                      >
                        <span>{s.day}</span>
                        <span>{s.startTime}</span>
                        <span>{s.endTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                id="phone"
                placeholder="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                id="address"
                placeholder="Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                About Doctor
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="about"
                rows="4"
                placeholder="Write about doctor"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="days"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Available Days
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                id="days"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Start Time
              </label>
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                id="startTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                End Time
              </label>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                id="endTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddDay}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Available Day
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddDoctor}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDoctor;
