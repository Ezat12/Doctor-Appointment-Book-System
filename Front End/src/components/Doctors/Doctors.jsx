import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import ItemsDoctors from "../ItemDoctors/ItemsDoctors";
import { IoFilterOutline } from "react-icons/io5";
import { IoMdArrowDropup } from "react-icons/io";

function Doctors() {
  const { state } = useLocation();
  const [dropDown, setDropDown] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [speciality, setSpeciality] = useState(state ? state : null);
  const specialityList = [
    "General physician",
    "Pediatricians",
    "Dermatologist",
    "Neurologist",
    "Gastroenterologist",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor`
      );
      setDoctors(response.data.doctors);
    };
    fetchData();
  }, []);

  const handleClickOutSide = (e) => {
    if (!e.target.closest(".drop-down")) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutSide);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  });

  return (
    <div className="doctors container mx-auto lg:px-0 md:px-0 px-3">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-gray-700 mt-6">
          Browse through the doctors specialist.
        </h1>
        <div className="lg:hidden md:hidden filter flex items-center gap-3 mt-6 p-4 rounded-xl border border-gray-300 relative drop-down">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setDropDown(!dropDown)}
          >
            <p className="font-medium">Filter</p>
            <IoFilterOutline size={"23px"} />
          </div>
          {dropDown && (
            <div className="">
              <div className="absolute -bottom-10 right-0">
                <IoMdArrowDropup size={"45px"} color="#f2f2f2" />
              </div>
              <div className="absolute top-20 right-0 bg-white shadow-2xl p-4 border border-gray-200 z-40">
                {specialityList.map((doc, index) => {
                  return (
                    <button
                      onClick={(e) => setSpeciality(e.target.innerHTML)}
                      key={index}
                      className={
                        speciality === doc
                          ? "p-3  border rounded-md text-start pr-20 mt-3 bg-[#e2e5ff]"
                          : "p-3  border rounded-md text-start pr-20 mt-3"
                      }
                    >
                      {doc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="lg:flex md:flex flex-col gap-4 mt-6 hidden">
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
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-6">
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
