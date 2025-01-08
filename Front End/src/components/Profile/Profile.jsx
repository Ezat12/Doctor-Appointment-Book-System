import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import img_pro from "../../assets/image-myprofile.png";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [phone, setPhone] = useState(user?.phone);
  const [gender, setGender] = useState(user?.gender);
  const [birthday, setBirthday] = useState(user?.birthday);
  // console.log(phone, gender, birthday);

  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/user/getDataUser`,
          { headers: { Authorization: `Barer ${Cookies.get("auth-token")}` } }
        );
        setUser(response.data.user);
      } catch (e) {
        const error = e.response.data.message;
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: `${error}!`,
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.remove("auth-token");
            navigator("/auth");
          }
        });
      }
    };
    fetchData();
  }, []);

  const handleSaveInformation = async () => {
    const data = {
      phone: phone ? phone : user.phone,
      gender: gender && gender !== "No Selected" ? gender : user.gender,
      birthday: birthday ? birthday : user.birthday,
    };

    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL_SERVER}/user/updateDataUser`,
      data,
      { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
    );

    console.log(response);
    toast.success("success save");
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="image">
        <img src={img_pro} width={"150px"} />
      </div>
      <h1 className="text-3xl font-semibold my-5 border-b-2 pb-3 w-96">
        {user?.name}
      </h1>
      <div className="">
        <p className="uppercase border-b w-fit">CONTACT INFORMATION</p>
        <div className="fle items-center mt-5 font-medium">
          <span>Email id: </span>
          <span className="ml-20 text-[#3b82f6]">{user?.email}</span>
        </div>
        <div className="fle items-center mt-3 font-medium">
          <span>Phone: </span>
          <span className="ml-20 ">
            {!edit ? (
              <span className="text-[#3b82f6]">{user.phone}</span>
            ) : (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type={"text"}
                className="px-2 py-1 border rounded-md focus:ring-blue-500 outline-none"
              />
            )}
          </span>
        </div>
        <p className="uppercase border-b w-fit mt-7">BASIC INFORMATION</p>
        <div className="fle items-center mt-3 font-medium">
          <span>Gender: </span>
          <span className="ml-20 ]">
            {user?.gender ? (
              edit ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="field"
                >
                  <option className="text-gray-600">No Selected</option>
                  <option className="text-gray-600">Male</option>
                  <option className="text-gray-600">Female</option>
                </select>
              ) : (
                <span className="text-gray-500">
                  {user?.gender ? (
                    <span className="text-[#3b82f6]">{user.gender}</span>
                  ) : (
                    "Not Selected"
                  )}
                </span>
              )
            ) : !edit ? (
              <span className="text-gray-500">
                {user?.gender ? (
                  <span className="text-[#3b82f6]">{user.gender}</span>
                ) : (
                  "Not Selected"
                )}
              </span>
            ) : (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="field"
              >
                <option className="text-gray-600">No Selected</option>
                <option className="text-gray-600">Male</option>
                <option className="text-gray-600">Female</option>
              </select>
            )}
          </span>
        </div>
        <div className="fle items-center mt-3 font-medium">
          <span>Birthday: </span>
          <span className="ml-20 ">
            {user?.birthday ? (
              !edit ? (
                <span className="text-[#3b82f6]">{user.birthday}</span>
              ) : (
                <input
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  type="date"
                />
              )
            ) : !edit ? (
              <span className="text-gray-500">Not Selected</span>
            ) : (
              <input
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                type="date"
              />
            )}
          </span>
        </div>

        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="rounded-2xl border transform duration-100 border-[#5f6fff] py-3 px-5 mt-5 font-medium hover:text-white hover:bg-[#5f6fff]"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSaveInformation}
            className="rounded-2xl border transform duration-100 border-[#5f6fff] py-3 px-5 mt-5 font-medium hover:text-white hover:bg-[#5f6fff]"
          >
            Save Information
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
