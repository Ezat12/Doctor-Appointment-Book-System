import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import ItemsDoctors from "../ItemsDoctors/ItemsDoctors";

function ListDoctor() {
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
    <div className="list-doctor">
      <h2 className="text-lg font-medium">All Doctor</h2>
      <div className="mt-6 grid grid-cols-5 gap-5">
        {doctors.map((doc, index) => {
          return <ItemsDoctors key={index} doctor={doc} />;
        })}
      </div>
    </div>
  );
}

export default ListDoctor;
