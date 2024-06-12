import React from "react";
import logo from "../../assets/logo.png";
import burger from "../../assets/burger.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import { Profile } from "./Profile";
export default function Main_navigation({ isshow, show }) {
  const user = useAuthStore((state) => state.user);
  const nav = useLocation().pathname.split('/')[2];
  console.log(nav)
console.log(user)
  return (
    <div className="  bg-white h-16 flex  justify-between ">
      <div className=" w-1/5 px-6 justify-between flex  items-center space-x-2 sticky top-0 ">
        <button
          onClick={() => {
            isshow(!show);
          }}
        >
          <img src={burger} alt="" className="" />
        </button>
        <img src={logo} alt="" className="w-12" />
        {/* <p className="font-bold hidden md:inline">EaseSched</p> */}
      </div>
      <div
        className={`h-full font-medium text-sm  ${
          user?.roleId === 1 ? " hidden " : " flex "
        } items-center space-x-8`}
      >
        <Link
          to={"/shift_manager/dashboard"}
          className={nav === "dashboard" ? "text-blue-500" : "text-black"}
        >
          Dashboard
        </Link>
        <Link
          to={"/shift_manager/employee/employee_information"}
          className={nav === "employee" ? "text-blue-500" : "text-black"}
        >
          Employees
        </Link>
        <Link
          to={"/shift_manager/generate_schedule/step_1"}
          className={
            nav === "generate_schedule" ? "text-blue-500" : "text-black"
          }
        >
          Generate Schedule
        </Link>
        <Link
          to={"/shift_manager/working_areas/Service"}
          className={nav === "working_areasof" ? "text-blue-500" : "text-black"}
        >
          Working Areas
        </Link>
      </div>
      <div className=" flex  items-center w-1/5 justify-center ">
        <Profile />
      </div>
    </div>
  );
}
