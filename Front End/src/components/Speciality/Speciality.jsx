import React from "react";
import image_1 from "../../assets/Speciality/General.svg";
import image_2 from "../../assets/Speciality/Dermatologist.svg";
import image_3 from "../../assets/Speciality/Pediatricians.svg";
import image_4 from "../../assets/Speciality/Naurologist.svg";
import image_5 from "../../assets/Speciality/Gaseroenterologist.svg";
import { Link } from "react-router";

function Speciality() {
  const data = [
    { image: image_1, speciality: "General physician" },
    { image: image_2, speciality: "Dermatologist" },
    { image: image_3, speciality: "Pediatricians" },
    { image: image_4, speciality: "Neurologist" },
    { image: image_5, speciality: "Gastroenterologist" },
  ];

  return (
    <div className="container mx-auto mt-20 mb-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Find by Speciality</h1>
        <p className="max-w-[500px] text-center m-auto text-sm font-medium text-gray-500">
          Simply browse through our extensive list of trusted doctors, schedule
          your appointment hassle-free.
        </p>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-10 mt-10">
        {data.map((item, index) => {
          return (
            <Link
              to={"/doctors"}
              state={item.speciality}
              key={index}
              className="flex flex-col gap-3 transform duration-300 cursor-pointer hover:-translate-y-2"
            >
              <div className="image">
                <img src={item.image} width={"100px"} />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {item.speciality}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Speciality;
