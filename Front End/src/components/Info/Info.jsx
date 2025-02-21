import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import group_profiles from "../../assets/group_profiles-BCL6AVF5.png";
import img_header from "../../assets/header_img-DhAi3lLA.png";
import { useNavigate } from "react-router";
import "./Info.css";

function Info() {
  const navigator = useNavigate();

  return (
    <div className="hero container mx-auto mt-6 bg-[#5f6fff]">
      <div className="lg:pl-20 lg:pr-14 lg:pt-28 pl-10 pr-6 pt-5 flex lg:justify-between">
        <div className="content">
          <p className="lg:text-5xl text-2xl font-bold text-white md:w-[450px] lg:w-[450px] w-fit leading-tight">
            Book Appointment With Trusted Doctors
          </p>
          <div className="flex lg:flex-row md:flex-row flex-col items-center gap-3 mt-10">
            <img src={group_profiles} />
            <div className="flex flex-col font-medium text-sm text-white">
              <p>Simply browse through our extensive list of</p>
              <p>trusted doctors,</p>
              <p>schedule your appointment hassle-free.</p>
            </div>
          </div>
          <button
            onClick={() => navigator("/doctors")}
            className="btn text-black lg:mt-20  mb-5  bg-[#fff] rounded-3xl text-lg  p-3 px-6 transform duration-300 flex items-center gap-4 hover:scale-110"
          >
            Book appointment
            <FaArrowRightLong className="mt-1" />
          </button>
        </div>
        <div className="image lg:block hidden">
          <img width={"580px"} src={img_header} />
        </div>
      </div>
    </div>
  );
}

export default Info;
