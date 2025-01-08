/* eslint-disable react/prop-types */
import React from 'react'

function ItemsDoctors(props) {

  const { doctor } = props;

  return (
    <div

      className="border-2 rounded-lg transform duration-300 cursor-pointer "
    >
      <div className="image bg-[#eaefff]">
        <img src={doctor.image} />
      </div>
      <div className="content p-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] mt-1"></span>
          <span className="text-[#22c55e] font-medium">Available</span>
        </div>
        <p className="text-lg font-semibold mt-1">Dr: {doctor.name}</p>
        <p className="mt-1  text-gray-600">{doctor.speciality}</p>
      </div>
    </div>
  );
}

export default ItemsDoctors