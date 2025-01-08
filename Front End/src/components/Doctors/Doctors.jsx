import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import ItemsDoctors from "../ItemDoctors/ItemsDoctors";

function Doctors() {
  const { state } = useLocation();
  console.log(state);

  const [doctors, setDoctors] = useState([]);

  const [speciality, setSpeciality] = useState(state ? state : null);
  const specialityList = [
    "General physician",
    "Pediatricians",
    "Dermatologist",
    "Neurologist",
    "Gastroenterologist",
  ];
  console.log(speciality);

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
    <div className="doctors container mx-auto">
      <h1 className="font-medium text-gray-700 mt-6">
        Browse through the doctors specialist.
      </h1>
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-4 mt-6">
          {specialityList.map((doc, index) => {
            return (
              <button
                onClick={(e) => setSpeciality(e.target.innerHTML)}
                key={index}
                className={
                  speciality === doc
                    ? "p-3  border rounded-md text-start pr-20 bg-[#e2e5ff]"
                    : "p-3  border rounded-md text-start pr-20"
                }
              >
                {doc}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-5 mt-6">
          {doctors.map((doc, index) => {
            return (
              (speciality === null || speciality === doc.speciality) && (
                <ItemsDoctors doctor={doc} />
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
