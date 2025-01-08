import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import group_profiles from "../../assets/group_profiles-BCL6AVF5.png";
import img_header from "../../assets/header_img-DhAi3lLA.png";
import { useNavigate } from "react-router";
import Info from "../Info/Info";
import Speciality from "../Speciality/Speciality";
import HomeDoctors from "../HomeDoctors/HomeDoctors";

function Hero() {
  const navigator = useNavigate();

  return (
    <>
      <Info />
      <Speciality />
      <HomeDoctors />
    </>
  );
}

export default Hero;
