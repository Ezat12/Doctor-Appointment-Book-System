import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import group_profiles from "../../assets/group_profiles-BCL6AVF5.png";
import img_header from "../../assets/header_img-DhAi3lLA.png";
import { useNavigate } from "react-router";

function Info() {
  const navigator = useNavigate();

  return (
    <div className="hero container mx-auto mt-6 bg-[#5f6fff]">
      <div className="pl-20 pr-14 pt-28 flex justify-between">
        <div className="content">
          <p className="text-5xl font-bold text-white w-[450px] leading-tight">
            Book Appointment With Trusted Doctors
          </p>
          <div className="flex items-center gap-3 mt-10">
            <img src={group_profiles} />
            <div className="flex flex-col font-medium text-sm text-white">
              <p>Simply browse through our extensive list of</p>
              <p>trusted doctors,</p>
              <p>schedule your appointment hassle-free.</p>
            </div>
          </div>
          <button
            onClick={() => navigator("/doctors")}
            className="text-black mt-20 bg-[#fff] rounded-3xl text-lg  p-3 px-6 transform duration-300 flex items-center gap-4 hover:scale-110"
          >
            Book appointment
            <FaArrowRightLong className="mt-1" />
          </button>
        </div>
        <div className="image ">
          <img width={"580px"} src={img_header} />
        </div>
      </div>
    </div>
  );
}

export default Info;
