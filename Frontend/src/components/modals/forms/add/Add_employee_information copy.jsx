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

function Add_employee_information(props) {
  const { employeeRefetch } = useQueryEmployees();
  const [timeabailable, setTimeAvailable] = useState([
  
  ]);

  const day = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const submit = (e) => {
    e.preventDefault();
    //     {
    //     "name":e.target[1].value,
    //     "poscod": e.target[0].value,
    //     "hired_date": "2024-03-24",
    //     "identification_number": e.target[1].value,
    //     "status": "Active",
    //     "record_status": "Active",
    //     "availability": [
    //         {
    //             "day_name": "sunday",
    //             "shift_start": "3:00 PM",
    //             "shift_end": "11:00 PM"
    //         },
    //         {
    //             "day_name": "monday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         },
    //         {
    //             "day_name": "tuesday",
    //             "shift_start": "5:00 PM",
    //             "shift_end": "1:00 AM"
    //         },
    //         {
    //             "day_name": "wednesday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         },
    //         {
    //             "day_name": "thursday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         },
    //         {
    //             "day_name": "friday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         },
    //         {
    //             "day_name": "saturday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         },
    //         {
    //             "day_name": "sunday",
    //             "shift_start": "7:30 AM",
    //             "shift_end": "1:30 PM"
    //         }
    //     ],
    //     "area_name": "Dining"
    // }

    const formatTime = [
      {
        day_name: "sunday",
        shifts:[]
      },
      {
        day_name: "monday",
        shifts:[]
      },
      {
        day_name: "tuesday",
        shifts:[]
      },
      {
        day_name: "wednesday",
        shifts:[]
      },
      {
        day_name: "thursday",
        shifts:[]
      },
      {
        day_name: "friday",
        shifts:[]
      },
      {
        day_name: "saturday",
        shifts:[]
      },
    ]

    console.log(timeabailable);
    timeabailable.map((time) => {
      formatTime.map((day) => {
        if (day.day_name === time.day_name) {
          day.shifts.push({
            shift_start: time.shift_start,
            shift_end: time.shift_end,
          });
        }
      });
    })

console.log({
  poscod: e.target[0].value,
  crew_id: e.target[1].value,
  name: e.target[2].value,
  hired_date: "2024-03-24",
  stations: ["Eggs", "Fries", "Prepping", "Assembler"],
  job_status: "Full-Time",
  availability: formatTime,
});
    const addmployee = async () => {

      try {
        
      const token = localStorage.getItem("token");
        const addemp = await axios.post(
          "http://localhost:3000/employee/add",
          {
            poscod: e.target[0].value,
            crew_id: e.target[1].value,
            name: e.target[2].value,
            availability: formatTime,
            stations: ["Eggs", "Fries", "Prepping", "Assembler"],
            job_status: "Full-Time",
            hired_date: "2024-03-24",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Include token type (Bearer)
            },
          }
        );
          employeeRefetch()
          alert("Employee Successfully Added")
          props.AddEmployee(false);
        }
        catch (error) {
          console.log(error)
          props.AddEmployee(true);
        }
      };
       
      addmployee();
  }


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
    <div className="h-full">
      <DialogDescription className="h-[100%]  ">
        <form
          onSubmit={submit}
          className=" space-y-5  h-full w-full flex flex-col justify-between"
        >
          <div className="flex w-full justify-between ">
      
            <div className="w-[48%] flex flex-col  items-start space-y-2">
              <label htmlFor="poscod">POSCOD</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-1">
                <img src={poscod} alt="" width={20} />
                <select
                  name="poscod"
                  id="posccod"
                  className="w-full bg-white outline-none border-none p-0 m-0"
                >
                  <option value="null">e.g Cashier</option>
                  <option value="CRE">CREW</option>
                </select>
              </div>
            </div>
            <div className="w-[48%] flex flex-col items-start space-y-2">
              <label htmlFor="Crew">Crew ID</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
                <img src={crewid} alt="" width={20} />
                <input
                required
                  type="text"
                  className="w-full outline-none border-none"
                  placeholder="e.g 0300207053"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start space-y-2">
            <label htmlFor="employeename">Employee Name</label>
            <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
              <img src={employeename} alt="" width={20} />
              <input
              required
                type="text"
                className="w-full outline-none border-none"
                placeholder="e.g juan dela cruz"
              />
            </div>
          </div>

          <div className="h-content overflow-hidden flex-1   ">
            <label htmlFor="Time" className="flex">
              Time Availability
            </label>
            <div className=" overflow-auto space-y-2 h-full ">
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
          <button
            onClick={addTtimeVailablilit}
            type="button"
            className="flex text-white   px-8 text-xs justify-center rounded-md  items-center w-fit bg-[#009BFF] gap-3"
          >
            <p className="text-lg">+ </p>
            <p>Add More</p>
          </button>
          <button
            type="submit"
            className="py-3 rounded-md text-white bg-[#48C65C]"
          >
            Add
          </button>
        </form>
      </DialogDescription>
    </div>
  );
}

export default Add_employee_information;
