import { useEffect, useState } from "react";
import axios from "axios";
import ItemsDoctors from "../ItemsDoctors/ItemsDoctors";
import { FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

function ListDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/doctor`
        );
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_SERVER}/doctor/${doctorId}`,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      Swal.fire("Deleted!", "Doctor has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete doctor.", "error");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading doctors...</div>;
  }

  return (
    <div className="list-doctor p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Our Doctors</h2>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {doctors.length === 0
            ? "No doctors available"
            : "No doctors match your search"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredDoctors.map((doctor) => (
            <ItemsDoctors
              key={doctor._id}
              doctor={doctor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListDoctor;
