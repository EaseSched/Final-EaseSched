import React, { useState } from "react";
import calendar from "@/assets/calendar.svg";
import clock from "@/assets/clock.svg";
import crewid from "@/assets/crewid.svg";
import employeename from "@/assets/employeename.svg";
import poscod from "@/assets/poscod.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import useQueryEmployees from "@/Hooks/shift-manager/Query/useQueryEmployees";
import useStations from "@/Hooks/shift-manager/store/useStations";
import { Calendar, X, XIcon } from "lucide-react";
import { set } from "date-fns";
import useQueryAllStation from "@/Hooks/shift-manager/Query/useQueryAllStation";

function Add_service_working_area(props) {
   const [timeabailable, setTimeAvailable] = useState([]);

   const day = [
     "monday",
     "tuesday",
     "wednesday",
     "thursday",
     "friday",
     "saturday",
     "sunday",
   ];

  const [employeeEnfomration, setEmployeeEnfomration] = useState({
    poscod: "",
    working_area: "",
    name: "",
    no_of_employees: "",
    stations: [],
    area_name: "",
    availability: [],
  });
  const [error, setError] = useState();
  const [added, setAdded] = useState();
  const {stationRefetch} = useQueryAllStation()
  const submit = (e) => {
    e.preventDefault();
    const formatTime = [
      {
        day_name: "sunday",
        shift_timings: [],
      },
      {
        day_name: "monday",
        shift_timings: [],
      },
      {
        day_name: "tuesday",
        shift_timings: [],
      },
      {
        day_name: "wednesday",
        shift_timings: [],
      },
      {
        day_name: "thursday",
        shift_timings: [],
      },
      {
        day_name: "friday",
        shift_timings: [],
      },
      {
        day_name: "saturday",
        shift_timings: [],
      },
    ];

    console.log(timeabailable);
    timeabailable.map((time) => {
      formatTime.map((day) => {
        if (day.day_name === time.day_name) {
          day.shift_timings.push({
            shift_start: time.shift_start,
            shift_end: time.shift_end,
          });
        }
      });
    });

    const formValue = {
      area_id: employeeEnfomration.working_area,
      number_of_employee: employeeEnfomration.no_of_employees,
      station_name: employeeEnfomration.area_name,
      availability: formatTime.filter((day) => day.shift_timings.length > 0),
    };
    console.log(formValue);

    const  addService = async () => {
    //   // http://localhost:3000/station/add
      try {
        
      const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:3000/station/add",
          formValue,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Include token type (Bearer)
            },
          }
        );
        console.log(response);
        
        setAdded(response.data.message);
        // erasing the data
        stationRefetch()
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
        console.log(error);
      }
    }
    addService();
  };

  const addDateToLeave = () => {
    const newTime = {
      id: timeabailable.length + 1,
      shift_start: "",
      shift_end: "",
    };

    setTimeAvailable([...timeabailable, newTime]);
  };
  return (
    <form onSubmit={submit} className="h-full  gap-6 ">
      <div className="h-full flex gap-6 flex-col lg:flex-row overflow-auto ">
        <div className="h-full lg:h-[83%] flex-1 pt-3">
          <div className="flex w-full justify-between gap-3 ">
            <div className="w flex flex-col  items-start space-y-2 flex-1">
              <label htmlFor="poscod">Working Area</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-1 h-12">
                <img src={poscod} alt="" width={20} />
                <select
                  name="poscod"
                  id="posccod"
                  placeholder="e.g Cashier"
                  className="w-full bg-white outline-none border-none p-0 m-0"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmployeeEnfomration((prev) => ({
                      ...prev,
                      working_area: e.target.value,
                    }));
                  }}
                >
                  <option value="">e.g Service</option>
                  <option value="2">Service</option>
                  <option value="1">production</option>
                </select>
              </div>
            </div>

            <div className="flex flex-1 justify-between  ">
              <div className="flex flex-col items-start space-y-2 flex-1">
                <label htmlFor="Crew">Number Of Employee</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 relative h-12">
                  <img src={crewid} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g 4"
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        no_of_employees: e.target.value,
                      }));
                    }}
                  />
                  {error?.working_area !== null ||
                    (error && (
                      <div className=" ease-in absolute top-[110%] rounded-md p-2 w-full bg-red-300   -left-2">
                        {error?.working_area}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w flex flex-col pt-2 items-start space-y-2 flex-1">
            <label htmlFor="poscod">Area Name</label>
            <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-1 h-12">
              <img src={poscod} alt="" width={20} />
              <input
                required
                type="text"
                className="w-full outline-none border-none"
                placeholder="e.g Pos"
                onChange={(e) => {
                  e.preventDefault();
                  setEmployeeEnfomration((prev) => ({
                    ...prev,
                    area_name: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className=" w-full h-full overflow-hidden flex-1  ">
            <div className="flex justify-between py-2">
              <label htmlFor="Time" className="flex">
                Possible Shifts{" "}
              </label>
              <button
                onClick={addDateToLeave}
                type="button"
                className="flex text-white   px-8 text-xs justify-center rounded-md  items-center w-fit bg-[#009BFF] gap-3"
              >
                <p className="text-lg">+ </p>
                <p>Add More</p>
              </button>
            </div>
            <div className=" overflow-auto space-y-2 h-full pb-14 ">
              {timeabailable.map((time, index) => {
                console.log(time.id);
                return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={time.id}
                  >
                    <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                      {/* <label htmlFor="" className="">
                              Day
                            </label> */}
                      <div className="flex gap-2">
                        <img src={calendar} alt="" width={15} />
                        <select
                          defaultValue={time.day}
                          className="h-7 text-xsw-full outline-none border-none  "
                          onChange={(e) => {
                            e.preventDefault();
                            console.log(e.target.value);
                            setTimeAvailable((prevTime) =>
                              //                          {
                              //   id: 1,
                              //   day_name: "tuesday",
                              //   shift_start: "12:13",
                              //   shift_end: "22:13",
                              // },
                              prevTime.map((item) =>
                                item.id === time.id
                                  ? { ...item, day_name: e.target.value }
                                  : item
                              )
                            );
                          }}
                        >
                          <option value="DEFAULT">Day</option>
                          {day.map((day, index) => (
                            <option value={day} key={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className=" h-full flex border border-[#D9D9D9] p-2 rounded-md space-x-5 justify-center flex-1 ">
                      <img src={clock} alt="" width={20} />
                      <div>
                        <label htmlFor="time" className="text-[#009BFF]">
                          Start With
                        </label>
                        <div className="flex ">
                          <input
                            required
                            type="time"
                            defaultValue={time.shift_start}
                            onChange={(e) => {
                              e.preventDefault();
                              console.log(e.target.value);
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? {
                                        ...item,
                                        shift_start: e.target.value,
                                      }
                                    : item
                                )
                              );
                            }}
                            name=""
                            id=""
                            className="w-full outline-none border-none h-7 text-xs before:none after:none "
                          />
                        </div>
                      </div>
                    </div>
                    <div className="  h-full flex border border-[#D9D9D9] p-2 rounded-md space-x-5 justify-center   flex-1">
                      <img src={clock} alt="" width={20} />
                      <div>
                        <label htmlFor="time" className="text-[#009BFF]">
                          End With
                        </label>
                        <div className="flex">
                          <input
                            required
                            type="time"
                            defaultValue={time.shift_end}
                            name=""
                            id=""
                            className="h-7 text-xs w-full  outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              console.log(e.target.value);
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? { ...item, shift_end: e.target.value }
                                    : item
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" h-full cursor-pointer">
                      <div
                        type="button"
                        onClick={() => {
                          const newTime = timeabailable.filter(
                            (times) => times.id !== time.id
                          );
                          setTimeAvailable(newTime);
                        }}
                      >
                        x
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="absolute bottom-20 rounded-md flex  bg-red-300 text-balance  p-2">
          <XIcon
            className="pr-2"
            onClick={() => {
              setError();
            }}
          />
          {error}
        </div>
      )}
      {
        added && (
          <div className="absolute bottom-20 rounded-md flex  bg-green-300 text-balance  p-2">
            <XIcon
              className="pr-2"
              onClick={() => {
                setAdded();
              }}
            />
            {added}
          </div>
        )
      }
      <button
        type="submit"
        className={`py-3 rounded-md w-full text-white ${
          employeeEnfomration.working_area == "" ||
          employeeEnfomration.no_of_employees == "" ||
          employeeEnfomration.area_name == "" ||
          timeabailable.length == 0
            ? "bg-green-200"
            : "bg-[#48C65C]"
        } `}
        disabled={
          employeeEnfomration.working_area == "" ||
          employeeEnfomration.no_of_employees == "" ||
          employeeEnfomration.area_name == "" ||
          timeabailable.length == 0
        }
      >
        Add
      </button>
    </form>
  );
}

export default Add_service_working_area;
