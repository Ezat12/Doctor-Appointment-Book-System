import axios from "axios";
import React, { useEffect, useState } from "react";
import ItemsDoctors from "../ItemDoctors/ItemsDoctors";
import img_appointment from "../../assets/appointment_img-DzbZlMsi.png";

function HomeDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor`
      );
      setDoctors(response.data.doctors);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto lg:mt-24 md:mt-24 mt-16 mb-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Top Doctors to Book</h1>
        <p className="max-w-[500px] text-center m-auto text-sm font-medium text-gray-500">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 mt-10">
        {doctors.map((doc, index) => {
          if (index <= 4) {
            return <ItemsDoctors key={index} doctor={doc} />;
          }
        })}
      </div>
      <div className="mt-6 text-center m-auto w-full  ">
        <button className="bg-[#eaefff] py-2 px-8 text-lg rounded-3xl ">
          More
        </button>
      </div>
      <div className="lg:mt-24 md:mt-24 mt-16">
        <div className="flex justify-between rounded-2xl bg-[#5f6fff] lg:p-28 md:p-20 p-5 relative">
          <div className="flex flex-col gap-10">
            <h1 className="lg:text-5xl md:text-5xl text-2xl font-bold text-white flex flex-col gap-3">
              <span>Book Appointment</span>
              <span>With 100+ Trusted Doctors</span>
            </h1>
            <button className=" py-3 px-6 w-fit bg-white rounded-3xl font-semibold transform duration-150 hover:scale-105">
              Create account
            </button>
          </div>
          <div className="image w-[400px] absolute -top-5 right-0 lg:block hidden">
            <img src={img_appointment} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDoctors;
