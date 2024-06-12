import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import axios from "axios";
import React, { useState } from "react";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: ""
  })
  return (
    <div className=" w-full p-5 ">
      <div>
        <p className="text-lg font-semibold">Personal Information</p>
        <p className="text-sm text-gray-300">View Profile</p>
      </div>

      <div className=" flex flex-col items-center">
        <div className="h-20 w-20 flex bg-[#E9F7FF] text-[#009BFF] justify-center items-center mr-2 rounded-full">
          <p className="font-extrabold text-[2rem]">
            {user.name?.slice(" ")[0][0].toLocaleUpperCase()}
            {user.name?.slice(" ")[1][0].toLocaleUpperCase()}
          </p>
        </div>
        <p className="text-lg font-semibold">{user.name}</p>
      </div>

      <div className="w-full px-[10rem] gap-6 flex flex-col pt-10 ">
        <div className="w-full flex  justify-between gap-5">
          <div className="flex-1 flex justify-between">
            <p className="p-3 w-40 font-semibold text-gray-600">ID Number</p>
            <div className="flex-1 flex justify-center items-center border  border-gray-400">
              {user.id_number}
            </div>{" "}
          </div>
          <div className="flex-1 flex justify-between">
            <p className="p-3 w-40 font-semibold text-gray-600">Role</p>
            <div className="flex-1 flex justify-center items-center border  border-gray-400">
            {user.roleId  === 2 ? "Service" : "Production" }
            </div>{" "}
          </div>
        </div>

        <div className="w-full flex  justify-between gap-5 ">
          <div className="flex-1 flex justify-between">
            <p className="p-3 w-40 font-semibold text-gray-600">Name</p>
            <div className="flex-1 flex justify-center items-center border  border-gray-400">
            {user.name}
            </div>{" "}
          </div>
          {/* <div className="flex-1 flex justify-between">
            <p className="p-3 w-40 font-semibold text-gray-600">Created By</p>
            <div className="flex-1 flex justify-center items-center border  border-gray-400">
              value
            </div>{" "}
          </div> */}
        </div>
        <div className="flex-1 flex justify-between">
          <p className="p-3 w-40 font-semibold text-gray-600">Password</p>
          <input
            onChange={(e) =>
              setPassword({ ...password, oldPassword: e.target.value })
            }
            value={password.oldPassword}
            type="password"
            className="flex-1 flex justify-center items-center border px-9  bg-transparent  border-gray-400"
          />
        </div>
        <div className="flex-1 flex justify-between">
          <p className="p-3 w-40 font-semibold text-gray-600">New Password</p>
          <input
            type="password"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({ ...password, newPassword: e.target.value })
            }
            className="flex-1 flex justify-center items-center border  px-9  bg-transparent border-gray-400"
          />{" "}
        </div>
      </div>
      {!(password.oldPassword === "" ||   password.newPassword === "") && (
        <div className="w-full flex items-center justify-center  gap-5 py-10">
          <button
            onClick={() => {
              setPassword({
                oldPassword: "",
                newPassword: "",
              });
            }}
            className="w-[10rem] py-2 text-sm border border-gray-400  rounded-md font-semibold"
          >
            Cancel
          </button>

          <button
            disabled={
              password.oldPassword === "" || password.newPassword === ""
            }

            onClick={(e) => {
              
              const ll  = async () => {
                
      const token = localStorage.getItem("token");
                try {
                  
                const response = await axios.put(`http://localhost:3000/user/${
                 user.userId
                }`,
                {
                  name: user.name,
                  is_active: 1,
                  password: password.newPassword,
                  id_number: user.id_number
                }
                ,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                  },
                });
                alert("success")

              
              
              } 
                catch (error) {

                  alert("error")
                  console.log(error)
                }
              }

              ll()
            }}
            className="w-[10rem] py-2 text-sm rounded-md bg-green-500 text-white font-semibold"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
