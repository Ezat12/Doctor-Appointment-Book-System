/* eslint-disable react/prop-types */
import React from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
function ItemsDoctors({ doctor, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(doctor._id);
      }
    });
  };

  return (
    <div className="border-2 rounded-lg transform duration-300 cursor-pointer hover:shadow-md relative group">
      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Doctor"
      >
        <FaTrash className="text-lg" />
      </button>

      <div className="image bg-[#eaefff] h-40 overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150"; // Fallback image
          }}
        />
      </div>

      <div className="content p-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] mt-1"></span>
          <span className="text-[#22c55e] font-medium">Available</span>
        </div>
        <p className="text-lg font-semibold mt-1">Dr. {doctor.name}</p>
        <p className="mt-1 text-gray-600">{doctor.speciality}</p>
      </div>
    </div>
  );
}

export default ItemsDoctors;
