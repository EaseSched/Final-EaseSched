import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
export default function Main_working_areas() {
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
          <p className="font-semibold text-xl">Working Area</p>
          <p className="text-xs text-[#C2C2C2]">List of Working area</p>
        </div>
        <div className="rounded-full text-xs text-center bg-white w-fit flex h-10  justify-center items-center px-2 space-x-3">
          <Link
            onClick={() => setLocation("Station")}
            to={"/shift_manager/working_areas/Station"}
            className={`rounded-full h-[70%] px-5 flex justify-center items-center ${
              location === "Station"
                ? " bg-[#4CA8FF] text-white"
                : " bg-white text-black "
            }`}
          >
            Production
          </Link>
          <Link
            onClick={() => setLocation("Service")}
            to={"/shift_manager/working_areas/Service"}
            className={`rounded-full h-[70%] px-5 flex justify-center items-center ${
              location === "Service"
                ? " bg-[#4CA8FF] text-white"
                : " bg-white text-black "
            }`}
          >
            Service
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
