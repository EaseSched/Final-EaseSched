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

function Add_employee_information(props) {
  const { employeeRefetch } = useQueryEmployees();
  const [timeabailable, setTimeAvailable] = useState([]);

  const [chosenStations, setchosenStations] = useState([]);

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
    crew_id: "",
    name: "",
    hired_date: "",
    stations: [],
    job_status: "",
    availability: [],
  });
  const [error, setError] = useState()
   const submit = (e) => {
    e.preventDefault();

    const formatTime = [
      {
        day_name: "sunday",
        shifts: [],
      },
      {
        day_name: "monday",
        shifts: [],
      },
      {
        day_name: "tuesday",
        shifts: [],
      },
      {
        day_name: "wednesday",
        shifts: [],
      },
      {
        day_name: "thursday",
        shifts: [],
      },
      {
        day_name: "friday",
        shifts: [],
      },
      {
        day_name: "saturday",
        shifts: [],
      },
    ];

    

    timeabailable.map((time) => {
      formatTime.map((day) => {
        if (day.day_name === time.day_name) {
          day.shifts.push({
            shift_start: time.shift_start,
            shift_end: time.shift_end,
          });
        }
      });
    });
    
   
  

    const addmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const addemp = await axios.post(
          "http://localhost:3000/employee/add",
          {
            poscod: employeeEnfomration.poscod,
            crew_id: employeeEnfomration.crew_id,
            name: employeeEnfomration.name,
            availability: formatTime,
            stations: chosenStations,
            job_status: employeeEnfomration.job_status,
            hired_date: employeeEnfomration.hired_date,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Include token type (Bearer)
            },
          }
        );
        employeeRefetch();
                  alert("Employee Successfully Added");

        setError()
        props.AddEmployee(false);
      } catch (error) {
        setError(error.response.data.error);
        props.AddEmployee(true);
      }
    };

    addmployee();
  };

  const stations = useStations((state) => state.stations);
  const addTtimeVailablilit = () => {
    const newTime = {
      id: timeabailable.length + 1,
      day_name: "DEFAULT",
      shift_start: "",
      shift_end: "",
    };

    setTimeAvailable([...timeabailable, newTime]);
  };
  return (
    <form onSubmit={submit} className="h-full  gap-6">
      <div className="h-full flex gap-6 flex-col lg:flex-row overflow-auto">
        <div className="h-fit flex-2 pt-3  ">
          <div className=" space-y-5  h-fit w-full flex flex-col  ">
            <div className="flex w-full justify-between gap-3 ">
              <div className="w flex flex-col  items-start space-y-2 flex-1">
                <label htmlFor="poscod">POSCOD</label>
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
                        poscod: e.target.value,
                      }));
                    }}
                  >
                    <option value="">e.g Cashier</option>
                    <option value="CRE">CREW</option>
                    <option value="CT">CREW TRAINEE</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2 flex-1">
                <label htmlFor="Crew">Crew ID</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 relative h-12">
                  <img src={crewid} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g 0300207053"
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        crew_id: e.target.value,
                      }));
                    }}
                  />
                  {error?.crew_id !== null ||
                    (error && (
                      <div className=" ease-in absolute top-[110%] rounded-md p-2 w-full bg-red-300   -left-2">
                        {error?.crew_id}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between  ">
              <div className=" flex flex-col w-full items-start space-y-2">
                <label htmlFor="employeename">Employee Name</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
                  <img src={employeename} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g juan dela cruz"
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* <div className="flex w-full justify-between gap-3 ">
              <div className=" flex-1 flex flex-col items-start space-y-2">
                <label htmlFor="Crew">Hired Date</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
                  <img src={calendar} alt="" width={20} />
                  <input
                    required
                    type="date"
                    className="w-full outline-none border-none"
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        hired_date: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2 flex-1 ">
                <label htmlFor="Crew"> Status</label>
                <div className="flex w-full border border-[#D9D9D9] s p-3 rounded-md space-x-2 full">
                  <img src={crewid} alt="" width={20} />
                  <select
                    required
                    type="text"
                    className="w-full outline-none border-none h-6"
                    placeholder="e.g 0300207053"
                    defaultValue={"Full-Time"}
                    onChange={(e) => {
                      e.preventDefault();
                      console.log(e.target.value);
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        job_status: e.target.value,
                      }));
                    }}
                  >
                    <option value="DEFAULT">Status</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>
              </div>
            </div> */}

            <div className="w-full h-full  ">
              <p className="pb-1">Trained Area</p>
              <div className="flex justify-evenly over  px-5">
                <div className="flex-1">Production</div>
                <div className="flex-1">Serice</div>
              </div>
              <div className="flex justify-evenly  h-[210px]  px-5 pt-4  ">
                <div className=" flex-1 h-full overflow-auto     ">
                  <div className="flex  h-full  overflow-auto  flex-col  gap-2">
                    {stations
                      .filter((stat) => stat.area_name === "Production")
                      .map((station, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onClick={(e) => {
                              if (e.target.checked) {
                                setchosenStations([
                                  ...chosenStations,
                                  station.station_name,
                                ]);
                              } else {
                                setchosenStations(
                                  chosenStations.filter(
                                    (stat) => stat !== station.station_name
                                  )
                                );
                              }
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                stations: chosenStations,
                              }));
                            }}
                          />
                          <label htmlFor={station.station_name}>
                            {station.station_name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="  flex-1 overflow-auto h-full  ">
                  <div className="flex  h-full   flex-col  gap-2  ">
                    {stations
                      .filter((stat) => stat.area_name === "Service")
                      .map((station, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onClick={(e) => {
                              if (e.target.checked) {
                                setchosenStations([
                                  ...chosenStations,
                                  station.station_name,
                                ]);
                              } else {
                                setchosenStations(
                                  chosenStations.filter(
                                    (stat) => stat !== station.station_name
                                  )
                                );
                              }
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                stations: chosenStations,
                              }));
                            }}
                          />
                          <label htmlFor={station.station_name}>
                            {station.station_name}
                          </label>
                        </div>
                      ))}
                    {stations
                      .filter((stat) => stat.area_name === "Service")
                      .map((station, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onClick={(e) => {
                              if (e.target.checked) {
                                setchosenStations([
                                  ...chosenStations,
                                  station.station_name,
                                ]);
                              } else {
                                setchosenStations(
                                  chosenStations.filter(
                                    (stat) => stat !== station.station_name
                                  )
                                );
                              }
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                stations: chosenStations,
                              }));
                            }}
                          />
                          <label htmlFor={station.station_name}>
                            {station.station_name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full lg:h-[83%] flex-1 pt-3">
          <div className="flex w-full justify-between gap-3 ">
            <div className=" flex-1 flex flex-col items-start space-y-2 ">
              <label htmlFor="Crew">Hired Date</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 h-12">
                <img src={calendar} alt="" width={20} />
                <input
                  required
                  type="date"
                  className="w-full outline-none border-none"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmployeeEnfomration((prev) => ({
                      ...prev,
                      hired_date: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start space-y-2  flex-1 ">
              <label htmlFor="Crew"> Status</label>
              <div className="flex w-full border border-[#D9D9D9] s p-3 rounded-md space-x-2 full h-12">
                <img src={crewid} alt="" width={20} />
                <select
                  required
                  type="text"
                  className="w-full outline-none border-none h-6"
                  placeholder="e.g 0300207053"
                  defaultValue={""}
                  onChange={(e) => {
                    e.preventDefault();
                    console.log(e.target.value);
                    setEmployeeEnfomration((prev) => ({
                      ...prev,
                      job_status: e.target.value,
                    }));
                  }}
                >
                  <option value="">Status</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" w-full h-full overflow-hidden flex-1  ">
            <div className="flex justify-between py-2">
              <label htmlFor="Time" className="flex">
                Time Availability
              </label>
              <button
                onClick={addTtimeVailablilit}
                type="button"
                className="flex text-white   px-8 text-xs justify-center rounded-md  items-center w-fit bg-[#009BFF] gap-3"
              >
                <p className="text-lg">+ </p>
                <p>Add More</p>
              </button>
            </div>
            <div className=" overflow-auto space-y-2 h-full w-full pb-14 ">
              {timeabailable.map((time, index) => {
                return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={time.id}
                  >
                    <div className="flex border border-[#D9D9D9]  rounded-md space-x-2 px-3 justify-center items-center w-full h-12 ">
                      <div className="flex ">
                        <img src={calendar} alt="" width={15} />
                        <select
                          defaultValue={time.day}
                          className="h-7 text-xsw-full outline-none border-none w-full  "
                          onChange={(e) => {
                            e.preventDefault();
                            setTimeAvailable((prevTime) =>
                              prevTime.map((item) =>
                                item.id === time.id
                                  ? { ...item, day_name: e.target.value }
                                  : item
                              )
                            );
                            setEmployeeEnfomration((prev) => ({
                              ...prev,
                              availability: timeabailable,
                            }));
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
                    <div className=" w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12">
                      {/* <img src={clock} alt="" width={20} /> */}
                      <div>
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          Start With
                        </label>
                        <div className="flex ">
                          <input
                            required
                            type="time"
                            defaultValue={time.shift_start}
                            onChange={(e) => {
                              e.preventDefault();
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
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                availability: timeabailable,
                              }));
                            }}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12">
                      {/* <img src={clock} alt="" width={20} /> */}
                      <div className="p-0 m-0">
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          End With
                        </label>
                        <div className="flex">
                          <input
                            required
                            type="time"
                            defaultValue={time.shift_end}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? { ...item, shift_end: e.target.value }
                                    : item
                                )
                              );
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                availability: timeabailable,
                              }));
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

                          setEmployeeEnfomration((prev) => ({
                            ...prev,
                            availability: timeabailable,
                          }));
                        }}
                        className="flex justify-center items-center w-full h-full   rounded-md"
                      >
                        <XIcon className="h-5 w-5" color="black" />
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
      <button
        type="submit"
        className={`py-3 rounded-md w-full text-white ${
          employeeEnfomration.poscod == "" ||
          employeeEnfomration.crew_id == "" ||
          employeeEnfomration.name == "" ||
          employeeEnfomration.hired_date == "" ||
          employeeEnfomration.job_status == ""
            ? "bg-green-200"
            : "bg-[#48C65C]"
        } `}
        disabled={
          employeeEnfomration.poscod == "" ||
          employeeEnfomration.crew_id == "" ||
          employeeEnfomration.name == "" ||
          employeeEnfomration.hired_date == "" ||
          employeeEnfomration.job_status == ""
        }
      >
        Add
      </button>
    </form>
  );
}

export default Add_employee_information;
