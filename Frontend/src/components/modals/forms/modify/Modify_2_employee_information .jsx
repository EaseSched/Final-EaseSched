import React, { useEffect, useRef, useState } from "react";
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

function Modify_2_employee_information(props) {
  const { employeeRefetch } = useQueryEmployees();
  const [timeabailable, setTimeAvailable] = useState([]);

  const forms = useRef();
  const [chosenStations, setchosenStations] = useState(
    props.employee.stations_assigned
  );

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
    poscod: props.employee.poscod,
    crew_id: props.employee.crew_id,
    name: props.employee.name,
    hired_date: props.employee.hired_date.split("T")[0],
    stations: props.employee.stations_assigned,
    job_status: props.employee.job_status,
    availability: timeabailable,
  });
  const [last_Time, setLastTime] = useState([]);
  const [lastkast, setlastkast] = useState();
  
  useEffect(() => {
    let timevaalbale = [];
    let count = 0;

    for (const day in props.employee.availability) {
      if (props.employee.availability[day].length != 0) {
        props.employee.availability[day].map((element) => {
          timevaalbale.push({
            id: count++,
            day_name: day,
            shift_start: element.shift_start,
            shift_end: element.shift_end,
          });
        });
      }
    }
    setTimeAvailable(timevaalbale);
    setLastTime(timevaalbale);
    setEmployeeEnfomration({
      ...employeeEnfomration,
      availability: timevaalbale,
    });
    setlastkast({
      poscod: props.employee.poscod,
      crew_id: props.employee.crew_id,
      name: props.employee.name,
      hired_date: props.employee.hired_date.split("T")[0],
      stations: props.employee.stations_assigned,
      job_status: props.employee.job_status,
      availability: last_Time,
    });

    console.log(timeabailable,"sddddddddddddd")
  }, []);
  const oldInfomration = {
    poscod: props.employee.poscod,
    crew_id: props.employee.crew_id,
    name: props.employee.name,
    hired_date: props.employee.hired_date.split("T")[0],
    stations: props.employee.stations_assigned,
    job_status: props.employee.job_status,
    availability: timeabailable,
  };
  const [error, setError] = useState();
  const submitbttn = useRef();
  const [isEqual, seEqual] = useState();
  useEffect(() => {
    const old_stations = oldInfomration.stations;
    const new_station = chosenStations;

    const old_time = last_Time.map((index) => JSON.stringify(index));
    const new_Time = timeabailable.map((index) => JSON.stringify(index));


    const isThereAnythingNewSttion = [
      ...old_stations.map((station) => {
        return new_station.includes(station);
      }),
      new_station.length == old_stations.length,
    ];
    const isThereAnythingNewTime = [
      ...old_time.map((time) => {
        return new_Time.includes(time);
      }),
      new_Time.length == old_time.length,
    ];
    const equlOtherInfo = [
      employeeEnfomration.poscod === oldInfomration.poscod,
      employeeEnfomration.job_status === oldInfomration.job_status,
    ];

    seEqual(
      [
        ...isThereAnythingNewSttion,
        ...isThereAnythingNewTime,
        ...equlOtherInfo,
      ].includes(false)
    );

    // const old = [
    //   oldInfomration.poscod,
    //   oldInfomration.crew_id,
    //   oldInfomration.name,
    //   oldInfomration.hired_date,
    //   oldInfomration.stations,
    //   oldInfomration.availability,
    // ];
  }, [employeeEnfomration, timeabailable, chosenStations]);

  const [isUpdate, setUpdate] = useState();
  const submit = (e) => {
    e.preventDefault();

    // const formatTime = [
    //   {
    //     day_name: "sunday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "monday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "tuesday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "wednesday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "thursday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "friday",
    //     shifts: [],
    //   },
    //   {
    //     day_name: "saturday",
    //     shifts: [],
    //   },
    // ];

    // timeabailable.map((time) => {
    //   formatTime.map((day) => {
    //     if (day.day_name === time.day_name) {
    //       day.shifts.push({
    //         shift_start: time.shift_start,
    //         shift_end: time.shift_end,
    //       });
    //     }
    //   });
    // });

    console.log(timeabailable);
    // const obstbyday = {
    //   sunday: formatTime[0].shifts,
    //   monday: formatTime[1].shifts,
    //   tuesday: formatTime[2].shifts,
    //   wednesday: formatTime[3].shifts,
    //   thursday: formatTime[4].shifts,
    //   saturday: formatTime[5].shifts,
    //   sunday: formatTime[6].shifts,
    // };
    const obstbyday = {
      sunday: timeabailable
        .filter((time) => time.day_name === "sunday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      monday: timeabailable
        .filter((time) => time.day_name === "monday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      tuesday: timeabailable
        .filter((time) => time.day_name === "tuesday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      wednesday: timeabailable
        .filter((time) => time.day_name === "wednesday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      thursday: timeabailable
        .filter((time) => time.day_name === "thursday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      friday: timeabailable
        .filter((time) => time.day_name === "friday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
      saturday: timeabailable
        .filter((time) => time.day_name === "saturday")
        .map((time) => {
          return { shift_start: time.shift_start, shift_end: time.shift_end };
        }),
    };

    console.log("MODIFY HERE! ", {
      poscod: employeeEnfomration.poscod,
      crew_id: employeeEnfomration.crew_id,
      name: employeeEnfomration.name,
      availability: obstbyday,
      stations_assigned: chosenStations,
      job_status: employeeEnfomration.job_status,
      hired_date: employeeEnfomration.hired_date,
    });

    const addmployee = async () => {
      console.log("MODIFY HERE! ", {
        poscod: employeeEnfomration.poscod,
        crew_id: employeeEnfomration.crew_id,
        name: employeeEnfomration.name,
        availability: obstbyday,
        stations_assigned: chosenStations,
        job_status: employeeEnfomration.job_status,
        hired_date: employeeEnfomration.hired_date,
      });
      try {
        const token = localStorage.getItem("token");
        const addemp = await axios.put(
          `http://localhost:3000/employee/${props.employee.crew_id}`,
          {
            poscod: employeeEnfomration.poscod,
            crew_id: employeeEnfomration.crew_id,
            name: employeeEnfomration.name,
            availability: obstbyday,
            stations_assigned: chosenStations,
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

        setUpdate(`The information of Employee ${props.employee.crew_id} has been Updated`);
        employeeRefetch();
        setError();
        seEqual(false)
        props.ModifyUser(false);
      } catch (error) {
        setError(error.response.data.error);
        return;
      }
    };

    addmployee();
    if (isEqual || error) return;
    submitbttn.current.parentNode.classList.replace("fixed", "hidden");

    submitbttn.current.parentNode.previousSibling.classList.replace(
      "fixed",
      "hidden"
    );
  };

  const reset = () => {
    const pp = {
      poscod: "CT",
      crew_id: "props.employee.crew_id",
      name: "props.employee.name",
      hired_date: props.employee.hired_date.split("T")[0],
      stations: props.employee.stations_assigned,
      job_status: props.employee.job_status,
      availability: timeabailable,
    };

    setEmployeeEnfomration(pp);
    console.log(pp);
    console.log(employeeEnfomration);
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
    <form onSubmit={submit} className="h-full  gap-6" ref={forms}>
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
                    defaultValue={employeeEnfomration?.poscod}
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
                    disabled
                    defaultValue={employeeEnfomration.crew_id}
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
                    disabled
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g juan dela cruz"
                    defaultValue={employeeEnfomration.name}
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
                            defaultChecked={employeeEnfomration?.stations?.includes(
                              station.station_name
                            )}
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
                            defaultChecked={employeeEnfomration?.stations?.includes(
                              station.station_name
                            )}
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
            <div className=" flex-1 flex flex-col items-start space-y-2  ">
              <label htmlFor="Crew">Hired Date</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 h-12">
                <img src={calendar} alt="" width={20} />
                <input
                  disabled
                  required
                  type="date"
                  defaultValue={employeeEnfomration.hired_date}
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
                  defaultValue={props.employee.job_status}
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
                console.log(time,"time")
                return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={time.id}
                  >
                    <div className="flex border border-[#D9D9D9]  rounded-md space-x-2 px-3 justify-center items-center w-full h-12 ">
                      <div className="flex ">
                        <img src={calendar} alt="" width={15} />
                        <select
                          defaultValue={time.day_name}
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
                            defaultValue={(time?.shift_start.split(":")[0].length < 2 ? "0" : "")+time?.shift_start}
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
                            defaultValue={(time?.shift_end.split(":")[0].length < 2 ? "0" : "")+time?.shift_end}
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
      {isUpdate && (
        <div className="absolute bottom-20 rounded-md flex  bg-green-300 text-balance  p-2">
          <XIcon
            className="pr-2"
            onClick={() => {
              setUpdate();
            }}
          />
          {isUpdate}
        </div>
      )}

      <button
        type="submit"
        className={`py-3 rounded-md w-full text-white ${
          employeeEnfomration.poscod == "" ||
          employeeEnfomration.crew_id == "" ||
          employeeEnfomration.name == "" ||
          employeeEnfomration.hired_date == "" ||
          employeeEnfomration.job_status == "" ||
          isEqual === false
            ? "bg-green-200"
            : "bg-[#48C65C]"
        }   `}
        disabled={
          employeeEnfomration.poscod == "" ||
          employeeEnfomration.crew_id == "" ||
          employeeEnfomration.name == "" ||
          employeeEnfomration.hired_date == "" ||
          employeeEnfomration.job_status == "" ||
          isEqual === false
        }
        ref={submitbttn}
      >
        Modify
      </button>
    </form>
  );
}

export default Modify_2_employee_information;
