import React from "react";
import img_about from "../../assets/about_image-MG9zrc7b.png";

function About() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl text-gray-800 uppercase font-semibold text-center">
        About Us
      </h1>
      <div className="flex gap-6 mt-8 items-center">
        <div className="image">
          <img src={img_about} className="w-[750px]" />
        </div>
        <div>
          <p className=" text-gray-600 mb-4">
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="mt-4 text-gray-600 mb-4">
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <p className="my-5 font-bold ">Our Vision</p>
          <p className="mt-4 text-gray-600 mb-4">
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>
      <h3 className="text-xl text-gray-700 font-semibold uppercase mt-10">
        WHY CHOOSE US
      </h3>
      <div className="grid grid-cols-3 mt-5">
        <div className="border flex flex-col items-center justify-center p-10 transform duration-150 cursor-pointer hover:text-white  hover:bg-[#5f6fff]">
          <h3 className="uppercase text-gray-700 text-lg font-semibold">
            EFFICIENCY:
          </h3>
          <p className="mt-5 font-normal text-center transform ">
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border flex flex-col items-center justify-center p-10 transform duration-150 cursor-pointer hover:text-white hover:bg-[#5f6fff]">
          <h3 className="uppercase text-gray-700 text-lg font-semibold">
            CONVENIENCE:
          </h3>
          <p className="mt-5 font-normal text-center ">
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border flex flex-col items-center justify-center p-10 transform duration-150 cursor-pointer hover:text-white hover:bg-[#5f6fff]">
          <h3 className="uppercase text-gray-700 text-lg font-semibold">
            PERSONALIZATION:
          </h3>
          <p className="mt-5 font-normal text-center ">
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
