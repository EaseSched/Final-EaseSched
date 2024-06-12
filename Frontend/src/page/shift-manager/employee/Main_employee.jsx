import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
export default function Main_employee() {
  const [location, setLocation] = useState(
    window.location.pathname.split("/")[3]
  );
  
  useEffect(() => {
    setLocation(window.location.pathname.split("/")[3]);
    console.log(location);
  });
  return (
    <div className="w-full px-9">
      <div className="flex justify-between pt-4 items-center">
        <div>
          <p className="font-semibold text-xl">Employee</p>
          <p className="text-xs text-[#C2C2C2]">
            {location === "employee_on_leave"
              ? "Employee on Leave"
              : "List of Employee Information"}
          </p>
        </div>
        <div className="rounded-full text-xs text-center bg-white w-fit flex h-10  justify-center items-center px-2 space-x-3">
          <Link
            onClick={() => setLocation("employee_information")}
            to={"/shift_manager/employee/employee_information"}
            className={`rounded-full h-[70%] px-5 flex justify-center items-center ${
              location === "employee_information"
                ? " bg-[#4CA8FF] text-white"
                : " bg-white text-black "
            }`}
          >
            Employees Information
          </Link>
          <Link
            onClick={() => setLocation("employee_on_leave")}
            to={"/shift_manager/employee/employee_on_leave"}
            className={`rounded-full h-[70%] px-5 flex justify-center items-center ${
              location === "employee_on_leave"
                ? " bg-[#4CA8FF] text-white"
                : " bg-white text-black "
            }`}
          >
            Employee On Leave
          </Link>
        </div>
        <Link className="rounded-full text-center text-xs bg-[#4CA8FF] w-fit flex  justify-center items-center h-8 px-5 text-white">
          Generate Schedule
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
